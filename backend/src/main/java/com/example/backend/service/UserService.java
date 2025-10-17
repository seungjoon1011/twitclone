package com.example.backend.service;

import com.example.backend.dto.PostResponse;
import com.example.backend.dto.UserResponse;
import com.example.backend.dto.UserUpdateRequest;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final AuthenticationService authenticationService;

//    @Transactional(readOnly = true)
//    public UserResponse getUserByUsername(String username) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
//        return mapToUserResponse(user);
//    }
@Transactional(readOnly = true)
public Page<PostResponse> getUserPosts(Long userId, Pageable pageable) {
    User currentUser = authenticationService.getCurrentUser();
    Page<Post> posts = postRepository.findByUserIdAndNotDeleted(userId, pageable);
    return posts.map(post -> {
        PostResponse response = PostResponse.fromEntity(post);
        Long likeCount = likeRepository.countByPostId(post.getId());
        boolean isLiked = likeRepository.existsByUserAndPost(currentUser, post);
        Long commentCount = commentRepository.countByPostId(post.getId());

        response.setLikeCount(likeCount);
        response.setLiked(isLiked);
        response.setCommentCount(commentCount);

        return response;
    });
}
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userid: " + userId));
        return mapToUserResponse(user);
    }



    private UserResponse mapToUserResponse(User user) {
        User currentUser = authenticationService.getCurrentUser();

        boolean isFollowing = false;
        if(!currentUser.getId().equals(user.getId())) {
            isFollowing = followRepository.existsByFollowerAndFollowing(currentUser, user);
        }

        Long followersCount = followRepository.countFollowers(user);
        Long followingCount = followRepository.countFollowing(user);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profileImageUrl(user.getProfileImageUrl())
                .bio(user.getBio())
                .followersCount(followersCount)
                .followingCount(followingCount)
                .isFollowing(isFollowing)
                .build();
    }

    @Transactional
    public UserResponse updateProfile(UserUpdateRequest request) {
        // 1. 현재 로그인된 사용자 정보 가져오기
        User currentUser = authenticationService.getCurrentUser();
        if (currentUser == null) {
            throw new IllegalStateException("사용자가 인증되지 않았습니다.");
        }

        // 2. 요청 DTO의 데이터로 사용자 정보 업데이트
        currentUser.setFullName(request.getFullName());
        currentUser.setBio(request.getBio());

        // 추가로 필요한 필드 업데이트...

        // 3. 업데이트된 엔티티 저장
        User updatedUser = userRepository.save(currentUser);

        // 4. 업데이트된 엔티티를 DTO로 변환하여 반환
        return UserResponse.from(updatedUser);
    }
    @Transactional
    public UserResponse updateProfileImageUrl(String fileUrl) {
        User currentUser = authenticationService.getCurrentUser();
        // ... (예외 처리) ...

        // 🚨 1. URL 값 설정
        currentUser.setProfileImageUrl(fileUrl);

        // 🚨 2. DB에 저장
        User savedUser = userRepository.save(currentUser);

        return UserResponse.from(savedUser);
    }
}