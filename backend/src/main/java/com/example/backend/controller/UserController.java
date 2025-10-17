package com.example.backend.controller;

import com.example.backend.dto.UserResponse;
import com.example.backend.dto.UserUpdateRequest;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 기존의 getUserByUsername() 메서드는 그대로 유지하거나 삭제
//     @GetMapping("/username/{username}")
//     public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
//         UserResponse user = userService.getUserByUsername(username);
//         return ResponseEntity.ok(user);
//     }

    // 💡 새로운 메서드: userId를 사용하여 사용자 조회
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        UserResponse user = userService.getUserById(userId);
        System.out.println(userId);
        return ResponseEntity.ok(user);
    }
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> UpdateProfile(@RequestBody UserUpdateRequest request) {
        UserResponse updatedUser = userService.updateProfile(request);

        return ResponseEntity.ok(updatedUser);
    }
}
