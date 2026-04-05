package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: Superadmin manually uploads a PDF certificate for a trainee.
 */
public interface UploadManualCertificateUseCase {
    
    void upload(UUID traineeId, UUID courseId, String certificateNumber, byte[] pdfBytes, String filename);
}
