package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;
import com.nac.slogbaa.progress.application.port.in.UploadManualCertificateUseCase;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.shared.ports.FileStoragePort;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Service for Superadmin to manually upload a PDF certificate.
 */
public final class UploadManualCertificateService implements UploadManualCertificateUseCase {

    private final CertificateRepositoryPort certificateRepository;
    private final FileStoragePort fileStorage;
    private final CreateNotificationUseCase createNotificationUseCase;
    private final CoursePublicationPort coursePublicationPort;
    private final TraineeProgressRepositoryPort traineeProgressRepository;

    public UploadManualCertificateService(CertificateRepositoryPort certificateRepository,
                                           FileStoragePort fileStorage,
                                           CreateNotificationUseCase createNotificationUseCase,
                                           CoursePublicationPort coursePublicationPort,
                                           TraineeProgressRepositoryPort traineeProgressRepository) {
        this.certificateRepository = certificateRepository;
        this.fileStorage = fileStorage;
        this.createNotificationUseCase = createNotificationUseCase;
        this.coursePublicationPort = coursePublicationPort;
        this.traineeProgressRepository = traineeProgressRepository;
    }

    @Override
    public void upload(UUID traineeId, UUID courseId, String certificateNumber, byte[] pdfBytes, String filename) {
        // 1. Store the file
        var storageResult = fileStorage.store(pdfBytes, filename, "application/pdf", "certificates/manual");
        String fileUrl = storageResult.url();

        // 2. Delete existing if any (replace)
        certificateRepository.deleteByTraineeIdAndCourseId(traineeId, courseId);

        // 3. Save new certificate metadata
        String verificationCode = "manual-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        certificateRepository.save(new CertificateRepositoryPort.NewCertificateData(
                traineeId,
                courseId,
                certificateNumber,
                LocalDate.now(),
                100, // Manual upload assumes completion/pass
                verificationCode,
                fileUrl
        ));

        // 4. Ensure progress is marked as completed
        if (!traineeProgressRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            // If not even enrolled, we should probably enroll or at least warn. 
            // For now, we assume they are at least enrolled or we just create progress.
            // But requirement 5 says "All trainee progresses on the completed course should update well on all sides"
            traineeProgressRepository.updateCompletionStatus(traineeId, courseId, "COMPLETED", 100);
        } else {
            traineeProgressRepository.updateCompletionStatus(traineeId, courseId, "COMPLETED", 100);
        }

        // 5. Notify the trainee
        String courseTitle = coursePublicationPort.getCourseTitle(courseId).orElse("a course");
        try {
            createNotificationUseCase.createForTrainee(
                    traineeId,
                    "CERTIFICATE_UPLOADED",
                    "Certificate Uploaded",
                    "A new certificate has been uploaded for your completion of '" + courseTitle + "'.",
                    "/dashboard/certificates"
            );
        } catch (Exception ignored) {
        }
    }
}
