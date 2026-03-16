package com.nac.slogbaa.shared.ports.file;

/**
 * Result of a successful file upload. The URL is the path to serve the file (e.g. /uploads/courses/abc.jpg).
 */
public record FileUploadResult(
        String url,
        long size,
        String contentType
) {
    public FileUploadResult {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("url must not be blank");
        }
    }
}
