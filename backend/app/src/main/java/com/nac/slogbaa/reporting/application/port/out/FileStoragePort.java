package com.nac.slogbaa.reporting.application.port.out;

import java.util.UUID;

public interface FileStoragePort {
    String saveFile(UUID jobId, byte[] fileData, String filename);
    byte[] getFile(String fileUrl);
}
