package com.nac.slogbaa.reporting.infrastructure.adapter.out.storage;

import com.nac.slogbaa.reporting.application.port.out.FileStoragePort;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class LocalDiskStorageAdapter implements FileStoragePort {

    private final Path storageDirectory;

    public LocalDiskStorageAdapter() {
        this.storageDirectory = Paths.get("data", "reports").toAbsolutePath();
        try {
            Files.createDirectories(this.storageDirectory);
        } catch (IOException e) {
            throw new RuntimeException("Could not create report storage directory at: " + this.storageDirectory, e);
        }
    }

    @Override
    public String saveFile(UUID jobId, byte[] fileData, String filename) {
        try {
            Path filePath = this.storageDirectory.resolve(filename);
            Files.write(filePath, fileData);
            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save report file: " + filename, e);
        }
    }

    @Override
    public byte[] getFile(String fileUrl) {
        try {
            return Files.readAllBytes(Paths.get(fileUrl));
        } catch (IOException e) {
            throw new RuntimeException("Failed to read report file from: " + fileUrl, e);
        }
    }
}
