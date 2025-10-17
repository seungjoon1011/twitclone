package com.example.backend.dto;


import com.example.backend.entity.Post;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String content;
    //    private String imageUrl;
    private UserDto user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @JsonProperty("isOwner")
    private boolean isOwner;
    private Long likeCount;
    private boolean isLiked;
    private Long commentCount;
    public static PostResponse fromEntity(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .user(UserDto.fromEntity(post.getUser()))
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}