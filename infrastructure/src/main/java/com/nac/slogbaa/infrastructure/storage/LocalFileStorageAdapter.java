package com.nac.slogbaa.infrastructure.storage;

import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.file.FileStorageException;
import com.nac.slogbaa.shared.ports.file.FileUploadResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Stores uploaded files on the local filesystem. Serves as the default implementation
 * for development and small deployments. Files are stored under a configurable base directory.
 */
@Component
public class LocalFileStorageAdapter implements FileStoragePort {

    private static final Pattern SAFE_SUBDIR = Pattern.compile("^[a-zA-Z0-9_-]+$");
    private static final Pattern SAFE_EXTENSION = Pattern.compile("^\\.[a-zA-Z0-9]+$");

    private final Path basePath;

    public LocalFileStorageAdapter(@Value("${app.file.upload-dir:uploads}") String uploadDir) {
        this.basePath = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @Override
    public FileUploadResult store(byte[] content, String originalFilename, String contentType, String subdir) {
        if (content == null || content.length == 0) {
            throw new FileStorageException("File content must not be empty");
        }
        if (subdir == null || !SAFE_SUBDIR.matcher(subdir).matches()) {
            throw new FileStorageException("Invalid subdirectory: " + subdir);
        }

        String extension = extractExtension(originalFilename);
        String filename = UUID.randomUUID() + extension;
        Path targetDir = basePath.resolve(subdir);
        Path targetFile = targetDir.resolve(filename);

        try {
            Files.createDirectories(targetDir);
            Files.write(targetFile, content);
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file: " + e.getMessage(), e);
        }

        String url = "/uploads/" + subdir + "/" + filename;
        return new FileUploadResult(url, content.length, contentType != null ? contentType : "application/octet-stream");
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return "";
        }
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot < 0 || lastDot >= originalFilename.length() - 1) {
            return "";
        }
        String ext = "." + originalFilename.substring(lastDot + 1).toLowerCase();
        return SAFE_EXTENSION.matcher(ext).matches() ? ext : "";
    }
}
