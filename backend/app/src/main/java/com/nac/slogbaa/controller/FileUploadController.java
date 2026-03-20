package com.nac.slogbaa.controller;

import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.file.FileStorageException;
import com.nac.slogbaa.shared.ports.file.FileUploadResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * Hardened file upload endpoint.
 * <ul>
 *   <li>Allow-listed subdirectories only</li>
 *   <li>Magic-byte content sniffing to prevent MIME spoofing</li>
 *   <li>Never leaks internal error details to clients</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);

    private static final Set<String> ALLOWED_SUBDIRS = Set.of(
            "courses", "modules", "library", "profiles", "certificates"
    );

    // JPEG: FF D8 FF, PNG: 89 50 4E 47, GIF: 47 49 46, WebP: RIFF....WEBP, PDF: %PDF, ZIP/DOCX/XLSX/PPTX: PK
    private static final byte[] JPEG_MAGIC = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_MAGIC = {(byte) 0x89, 0x50, 0x4E, 0x47};
    private static final byte[] GIF_MAGIC = {0x47, 0x49, 0x46};
    private static final byte[] RIFF_MAGIC = {0x52, 0x49, 0x46, 0x46}; // WebP starts with RIFF
    private static final byte[] PDF_MAGIC = {0x25, 0x50, 0x44, 0x46}; // %PDF
    private static final byte[] PK_MAGIC = {0x50, 0x4B, 0x03, 0x04};  // PK (ZIP, DOCX, XLSX, PPTX)

    /** Document MIME types allowed for the 'library' subdirectory. */
    private static final Set<String> ALLOWED_DOCUMENT_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
            "text/csv",
            "application/zip"
    );

    private final FileStoragePort fileStoragePort;
    private final long maxSizeBytes;
    private final Set<String> allowedImageTypes;

    private static String sanitizeForLog(String value) {
        if (value == null) return null;
        // Prevent log injection by removing newlines/control chars.
        return value.replaceAll("[\\r\\n]", " ");
    }

    public FileUploadController(
            FileStoragePort fileStoragePort,
            @Value("${app.file.max-size-bytes:5242880}") long maxSizeBytes,
            @Value("${app.file.allowed-image-types:image/jpeg,image/png,image/gif,image/webp}") String allowedTypes) {
        this.fileStoragePort = fileStoragePort;
        this.maxSizeBytes = maxSizeBytes;
        this.allowedImageTypes = Set.of(allowedTypes.split(",\\s*"));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("subdir") String subdir) {

        if (file == null || file.isEmpty()) {
            return badRequest("No file provided");
        }

        // Allow-list subdirectories
        if (subdir == null || subdir.isBlank() || !ALLOWED_SUBDIRS.contains(subdir.trim().toLowerCase())) {
            return badRequest("Invalid subdirectory. Allowed: " + ALLOWED_SUBDIRS);
        }

        String contentType = file.getContentType();
        String safeSubdir = subdir.trim().toLowerCase();
        boolean isLibrary = "library".equals(safeSubdir);
        Set<String> allowedTypes = isLibrary
                ? combinedTypes()
                : allowedImageTypes;

        if (contentType == null || !allowedTypes.contains(contentType)) {
            return badRequest("Invalid file type. Allowed: " + allowedTypes);
        }

        // Library documents can be up to 20 MB
        long effectiveMaxSize = isLibrary ? Math.max(maxSizeBytes, 20 * 1024 * 1024) : maxSizeBytes;
        if (file.getSize() > effectiveMaxSize) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(Map.of("error", "File too large. Max size: " + (effectiveMaxSize / 1024) + " KB"));
        }

        try {
            byte[] content = file.getBytes();

            // Magic-byte content sniffing — reject MIME-spoofed files (images only; docs skip this)
            if (allowedImageTypes.contains(contentType) && !matchesMagicBytes(content, contentType)) {
                log.warn("Upload rejected: MIME type {} does not match file magic bytes", sanitizeForLog(contentType));
                return badRequest("File content does not match declared type");
            }
            // Basic magic-byte check for documents
            if (ALLOWED_DOCUMENT_TYPES.contains(contentType) && !matchesDocumentMagic(content, contentType)) {
                log.warn("Upload rejected: document MIME type {} does not match file magic bytes", sanitizeForLog(contentType));
                return badRequest("File content does not match declared type");
            }

            FileUploadResult result = fileStoragePort.store(
                    content,
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "file",
                    contentType,
                    safeSubdir
            );

            return ResponseEntity.ok(Map.of(
                    "url", result.url(),
                    "size", result.size(),
                    "contentType", result.contentType()
            ));
        } catch (FileStorageException e) {
            log.error("File storage error during upload: {}", sanitizeForLog(e.getMessage()), e);
            return serverError();
        } catch (Exception e) {
            log.error("Unexpected error during file upload: {}", sanitizeForLog(e.getMessage()), e);
            return serverError();
        }
    }

    private boolean matchesMagicBytes(byte[] content, String contentType) {
        if (content.length < 4) {
            return false;
        }
        return switch (contentType) {
            case "image/jpeg" -> startsWith(content, JPEG_MAGIC);
            case "image/png" -> startsWith(content, PNG_MAGIC);
            case "image/gif" -> startsWith(content, GIF_MAGIC);
            case "image/webp" -> startsWith(content, RIFF_MAGIC) && content.length >= 12
                    && content[8] == 'W' && content[9] == 'E'
                    && content[10] == 'B' && content[11] == 'P';
            default -> false;
        };
    }

    private static boolean startsWith(byte[] data, byte[] prefix) {
        if (data.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if (data[i] != prefix[i]) return false;
        }
        return true;
    }

    private Set<String> combinedTypes() {
        var combined = new java.util.HashSet<>(allowedImageTypes);
        combined.addAll(ALLOWED_DOCUMENT_TYPES);
        return combined;
    }

    private boolean matchesDocumentMagic(byte[] content, String contentType) {
        if (content.length < 4) return false;
        return switch (contentType) {
            case "application/pdf" -> startsWith(content, PDF_MAGIC);
            case "application/zip",
                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                 "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                 "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    -> startsWith(content, PK_MAGIC);
            // Legacy Office formats (.doc, .xls, .ppt) and text files skip magic check
            default -> true;
        };
    }

    private ResponseEntity<Map<String, Object>> badRequest(String message) {
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }

    private ResponseEntity<Map<String, Object>> serverError() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "File upload failed. Please try again later."));
    }
}
