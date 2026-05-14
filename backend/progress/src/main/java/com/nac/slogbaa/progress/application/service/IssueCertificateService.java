package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.port.in.IssueCertificateUseCase;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import java.time.LocalDate;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.context.ApplicationEventPublisher;
import com.nac.slogbaa.shared.events.SystemActivityEvent;
import com.nac.slogbaa.shared.ports.TraineeCourseQuizScorePort;
import org.springframework.transaction.annotation.Transactional;

/**
 * Issues certificate metadata when trainee completes course.
 * PDF generation is handled on the frontend for higher fidelity.
 */
@Transactional
public class IssueCertificateService implements IssueCertificateUseCase {

    private final CertificateRepositoryPort certificateRepository;
    private final TraineeProgressRepositoryPort traineeProgressRepository;
    private final TraineeCourseQuizScorePort traineeCourseQuizScorePort;
    private final ApplicationEventPublisher eventPublisher;

    public IssueCertificateService(
            CertificateRepositoryPort certificateRepository,
            TraineeProgressRepositoryPort traineeProgressRepository,
            TraineeCourseQuizScorePort traineeCourseQuizScorePort,
            ApplicationEventPublisher eventPublisher) {
        this.certificateRepository = certificateRepository;
        this.traineeProgressRepository = traineeProgressRepository;
        this.traineeCourseQuizScorePort = traineeCourseQuizScorePort;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public void issueIfEligible(UUID traineeId, UUID courseId) {
        System.out.println("[IssueCertificateService] Checking eligibility for trainee: " + traineeId + ", course: " + courseId);
        
        // 1. Check if already issued
        if (certificateRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            System.out.println("[IssueCertificateService] Certificate already exists. Skipping.");
            return;
        }

        // 2. Issuing metadata
        System.out.println("[IssueCertificateService] Issuing new certificate metadata...");

        // 3. Get score
        int scorePercent = traineeCourseQuizScorePort.getBestPassedScorePercent(traineeId, courseId)
                .orElse(100);

        // 4. Generate metadata
        String certificateNumber = "SLOGBAA-" + LocalDate.now().getYear() + "-"
                + String.format("%04d", ThreadLocalRandom.current().nextInt(1, 9999));
        String verificationCode = "verify-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        LocalDate issuedDate = LocalDate.now();

        certificateRepository.save(new CertificateRepositoryPort.NewCertificateData(
                traineeId,
                courseId,
                certificateNumber,
                issuedDate,
                scorePercent,
                verificationCode,
                null // No file URL initially; frontend will upload PDF upon preview
        ));

        System.out.println("[IssueCertificateService] Saved certificate: " + certificateNumber);

        // 5. Log activity
        try {
            eventPublisher.publishEvent(new SystemActivityEvent(
                    null,
                    "SYSTEM",
                    "CREATE",
                    courseId.toString(),
                    "Issued certificate metadata for courseId " + courseId + " to traineeId " + traineeId));
        } catch (Exception e) {
            System.err.println("Failed to publish system activity event for certificate: " + e.getMessage());
        }
    }
}
