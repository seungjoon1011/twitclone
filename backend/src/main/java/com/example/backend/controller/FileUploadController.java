package com.example.backend.controller;

import com.example.backend.dto.UserResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.service.FileUploadService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;
    private final FileUploadService fileUploadService;
    private final UserService userService;
    /**
     * 프로필 이미지 업로드
     */
    @PostMapping("/profile-image")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String fileUrl = fileUploadService.uploadProfileImage(file);
        UserResponse updatedUser = userService.updateProfileImageUrl(fileUrl);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    /**
     * 업로드된 이미지 서빙
     */
    @GetMapping("/profiles/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new ResourceNotFoundException("파일을 찾을 수 없습니다");
        }

        // Content-Type 자동 감지
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}