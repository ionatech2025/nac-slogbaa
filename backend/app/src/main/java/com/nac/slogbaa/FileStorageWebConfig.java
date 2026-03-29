package com.nac.slogbaa;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.EncodedResourceResolver;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.nio.file.Path;
import java.time.Duration;

/**
 * Serves uploaded files from local storage with security headers.
 * In production, files should be served via CDN/S3 presigned URLs instead.
 * <p>
 * Note: read access (GET/HEAD) for /uploads/** is permitAll in IamSecurityConfiguration
 * so &lt;img src&gt; and direct links work (browsers do not send JWT). Uploads use POST /api/files/upload (admin-only).
 * Security headers (nosniff, cache-control) are applied here.
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
                .addResourceLocations(location)
                .setCacheControl(CacheControl.maxAge(Duration.ofHours(1))
                        .cachePublic()
                        .mustRevalidate())
                .resourceChain(true)
                .addResolver(new EncodedResourceResolver())
                .addResolver(new PathResourceResolver());
    }
}
