package com.example.backend.security;

import com.example.backend.entity.AuthProvider;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("http://localhost:5173")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        // 1. OAuth2 사용자 정보 추출
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String login = oAuth2User.getAttribute("login");  // GitHub username
        Integer id = oAuth2User.getAttribute("id");
        System.out.println(oAuth2User);
        // 2. 사용자 조회 또는 생성
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setProviderId(id);
                    newUser.setEmail(email);
                    newUser.setUsername(login);
                    newUser.setFullName(login);  // 초기값
                    newUser.setProvider(AuthProvider.GITHUB);
                    return userRepository.save(newUser);
                });

        // 3. JWT 토큰 생성
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // 4. 프론트엔드로 리다이렉트 (토큰 전달)
        String redirectUrl = String.format(
                "%s/oauth2/callback?token=%s&refreshToken=%s",
                frontendUrl,
                accessToken,
                refreshToken
        );

        response.sendRedirect(redirectUrl);
    }
}