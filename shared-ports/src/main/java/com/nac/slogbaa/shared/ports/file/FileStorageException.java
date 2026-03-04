package com.nac.slogbaa.shared.ports.file;

/**
 * Thrown when file storage operations fail (e.g. I/O error, invalid input).
 */
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
