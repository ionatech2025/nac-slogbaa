package com.nac.slogbaa;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

/**
 * Serves uploaded files from the local upload directory at /uploads/**.
 * Files stored by LocalFileStorageAdapter are accessible via HTTP.
 */
@Configuration
public class FileStorageWebConfig implements WebMvcConfigurer {

    private final String uploadDir;

    public FileStorageWebConfig(@Value("${app.file.upload-dir:uploads}") String uploadDir) {
        this.uploadDir = uploadDir;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path basePath = Path.of(uploadDir).toAbsolutePath().normalize();
        String location = "file:" + basePath + "/";
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
