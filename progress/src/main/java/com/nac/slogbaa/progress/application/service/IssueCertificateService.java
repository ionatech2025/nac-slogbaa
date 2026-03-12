package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.progress.application.port.in.IssueCertificateUseCase;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.application.port.out.TraineeSettingsPort;
import com.nac.slogbaa.shared.ports.CertificatePdfGeneratorPort;
import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.TraineeCourseQuizScorePort;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Issues certificate when trainee completes course. Generates PDF, stores it, optionally emails.
 */
public final class IssueCertificateService implements IssueCertificateUseCase {

    private final CertificateRepositoryPort certificateRepository;
    private final TraineeProgressRepositoryPort traineeProgressRepository;
    private final CourseDetailsQueryPort courseDetailsQueryPort;
    private final TraineeCourseQuizScorePort traineeCourseQuizScorePort;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final CertificatePdfGeneratorPort pdfGenerator;
    private final FileStoragePort fileStorage;
    private final TraineeSettingsPort traineeSettingsPort;
    private final TraineeNotificationPort traineeNotificationPort;

    public IssueCertificateService(CertificateRepositoryPort certificateRepository,
                                  TraineeProgressRepositoryPort traineeProgressRepository,
                                  CourseDetailsQueryPort courseDetailsQueryPort,
                                  TraineeCourseQuizScorePort traineeCourseQuizScorePort,
                                  GetTraineeByIdUseCase getTraineeByIdUseCase,
                                  CertificatePdfGeneratorPort pdfGenerator,
                                  FileStoragePort fileStorage,
                                  TraineeSettingsPort traineeSettingsPort,
                                  TraineeNotificationPort traineeNotificationPort) {
        this.certificateRepository = certificateRepository;
        this.traineeProgressRepository = traineeProgressRepository;
        this.courseDetailsQueryPort = courseDetailsQueryPort;
        this.traineeCourseQuizScorePort = traineeCourseQuizScorePort;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.pdfGenerator = pdfGenerator;
        this.fileStorage = fileStorage;
        this.traineeSettingsPort = traineeSettingsPort;
        this.traineeNotificationPort = traineeNotificationPort;
    }

    @Override
    public void issueIfEligible(UUID traineeId, UUID courseId) {
        if (certificateRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            return;
        }
        if (!traineeProgressRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            return;
        }
        var progressOpt = traineeProgressRepository.findByTraineeId(traineeId).stream()
                .filter(p -> p.getCourseId().equals(courseId))
                .findFirst();
        if (progressOpt.isEmpty() || !"COMPLETED".equals(progressOpt.get().getStatus())) {
            return;
        }
        CourseDetails course = courseDetailsQueryPort.findCourseDetailsByIdIncludingUnpublished(courseId).orElse(null);
        if (course == null) return;
        TraineeDetails trainee = getTraineeByIdUseCase.getById(traineeId).orElse(null);
        if (trainee == null) return;

        int scorePercent = traineeCourseQuizScorePort.getBestPassedScorePercent(traineeId, courseId)
                .orElse(100);
        String traineeName = trainee.getFirstName() + " " + trainee.getLastName();
        String certificateNumber = "SLOGBA-" + LocalDate.now().getYear() + "-" + String.format("%04d", ThreadLocalRandom.current().nextInt(1, 9999));
        String verificationCode = "verify-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        LocalDate issuedDate = LocalDate.now();

        CertificatePdfGeneratorPort.CertificatePdfData pdfData = new CertificatePdfGeneratorPort.CertificatePdfData(
                traineeName,
                course.getTitle(),
                certificateNumber,
                issuedDate.toString(),
                scorePercent,
                course.getModules().stream().map(m -> m.getTitle()).toList()
        );
        byte[] pdfBytes = pdfGenerator.generatePdf(pdfData);

        var storageResult = fileStorage.store(pdfBytes, certificateNumber + ".pdf", "application/pdf", "certificates");
        String fileUrl = storageResult.url();

        certificateRepository.save(new CertificateRepositoryPort.NewCertificateData(
                traineeId,
                courseId,
                certificateNumber,
                issuedDate,
                scorePercent,
                verificationCode,
                fileUrl
        ));

        if (traineeSettingsPort.isCertificateEmailOptIn(traineeId)) {
            try {
                traineeNotificationPort.sendCertificateEmail(trainee.getEmail(), traineeName, course.getTitle(), pdfBytes);
            } catch (Exception e) {
            }
        }
    }
}
