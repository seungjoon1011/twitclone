package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import com.example.backend.entity.AuthProvider;
import org.springframework.security.authentication.AuthenticationManager;
import com.example.backend.dto.UserDto;
import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseStatus;

import static com.example.backend.dto.UserDto.fromEntity;


@Service
@RequiredArgsConstructor
public class AuthService {

    // 1. 의존성 주입 (PasswordEncoder와 AuthenticationManager 제외)
    private final UserRepository userRepository;
    private final JwtService jwtService;

    /**
     * 회원가입 로직
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. 이메일 중복 확인
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 2. 사용자 정보 생성 (User 엔티티)
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .provider(AuthProvider.LOCAL)// !!! 비밀번호를 암호화 없이 그대로 저장
                .build();

        // 3. 사용자 정보 저장
        user = userRepository.save(user);

        // 4. JWT 토큰 생성
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // 5. AuthResponse DTO로 변환하여 반환
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }

    /**
     * 로그인 로직
     */
    public AuthResponse login(AuthRequest request) {
        // 1. 이메일로 사용자 정보 조회
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일이 올바르지 않습니다."));

        // 2. 비밀번호 일치 여부 확인 (평문 비교)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다.");
        }

        // 3. 인증 성공 시, JWT 토큰 생성
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // 4. AuthResponse DTO로 변환하여 반환
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }

    /**
     * 토큰 갱신 로직 (이 부분은 변경 없음)
     */
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        final String refreshToken = request.getRefreshToken();
        final String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

            if (jwtService.isTokenValid(refreshToken, user)) {
                String newAccessToken = jwtService.generateToken(user);
                return AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .build();
            }
        }
        throw new IllegalArgumentException("Refresh Token이 유효하지 않습니다.");
    }
}
