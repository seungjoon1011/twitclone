//package com.example.backend.config;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    // application.yml 파일의 file.upload-dir 값을 주입받습니다. (예: /Users/sjlee/image)
//    @Value("${file.upload-dir}")
//    private String uploadDir;
//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // 🚨 이미지 접근 URL 경로 설정
//        registry.addResourceHandler("/api/upload/profiles/**")
//                // 🚨 실제 파일 저장 경로 설정 (file: 접두사 필수)
//                .addResourceLocations("file:" + uploadDir + "/");
//
//        // 💡 주의: file: 뒤에 경로가 디렉토리임을 나타내는 슬래시(/)를 붙여줍니다.
//    }
//}