package com.nac.slogbaa.controller;

import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.file.FileStorageException;
import com.nac.slogbaa.shared.ports.file.FileUploadResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

/**
 * Generic file upload endpoint. Returns the stored file URL for use when creating/updating
 * courses, modules, library resources, etc.
 */
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileStoragePort fileStoragePort;
    private final long maxSizeBytes;
    private final Set<String> allowedImageTypes;

    public FileUploadController(
            FileStoragePort fileStoragePort,
            @Value("${app.file.max-size-bytes:5242880}") long maxSizeBytes,
            @Value("${app.file.allowed-image-types:image/jpeg,image/png,image/gif,image/webp}") String allowedTypes) {
        this.fileStoragePort = fileStoragePort;
        this.maxSizeBytes = maxSizeBytes;
        this.allowedImageTypes = Set.of(allowedTypes.split(",\\s*"));
    }

    /**
     * Upload a file. Accepts multipart/form-data with:
     * - file: the file to upload (required)
     * - subdir: storage subdirectory, e.g. "courses" or "library" (required)
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("subdir") String subdir) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "No file provided"));
        }
        if (subdir == null || subdir.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "subdir is required (e.g. courses, library)"));
        }
        if (file.getSize() > maxSizeBytes) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(Map.of("error", "File too large. Max size: " + (maxSizeBytes / 1024) + " KB"));
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedImageTypes.contains(contentType)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file type. Allowed: " + allowedImageTypes));
        }
        try {
            byte[] content = file.getBytes();
            FileUploadResult result = fileStoragePort.store(
                    content,
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "file",
                    contentType,
                    subdir
            );
            return ResponseEntity.ok(Map.of(
                    "url", result.url(),
                    "size", result.size(),
                    "contentType", result.contentType()
            ));
        } catch (FileStorageException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }
}
