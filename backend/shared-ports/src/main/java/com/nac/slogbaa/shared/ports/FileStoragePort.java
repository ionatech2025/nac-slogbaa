package com.nac.slogbaa.shared.ports;

import com.nac.slogbaa.shared.ports.file.FileUploadResult;

/**
 * Port for storing uploaded files. Implementations may use local filesystem or object storage (S3, etc.).
 * Used by learning (course/module images), library resources, assessment, and other modules.
 */
public interface FileStoragePort {

    /**
     * Store a file and return the URL path to access it.
     *
     * @param content         file content (bytes)
     * @param originalFilename original filename (used to derive extension)
     * @param contentType     MIME type (e.g. image/jpeg)
     * @param subdir          subdirectory within upload root (e.g. "courses", "library")
     * @return result with URL path (e.g. "/uploads/courses/uuid.jpg"), size, and contentType
     * @throws com.nac.slogbaa.shared.ports.file.FileStorageException if storage fails
     */
    FileUploadResult store(byte[] content, String originalFilename, String contentType, String subdir);
}
