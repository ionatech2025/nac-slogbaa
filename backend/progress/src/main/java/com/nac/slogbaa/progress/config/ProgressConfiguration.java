package com.nac.slogbaa.progress.config;

import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.learning.application.port.out.CourseSummaryQueryPort;
import com.nac.slogbaa.shared.ports.CertificatePdfGeneratorPort;
import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.TraineeCourseQuizScorePort;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import com.nac.slogbaa.progress.application.port.in.EnrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.in.GetLeaderboardUseCase;
import com.nac.slogbaa.progress.application.port.in.GetResumePointUseCase;
import com.nac.slogbaa.progress.application.port.in.IssueCertificateUseCase;
import com.nac.slogbaa.progress.application.port.in.ListCertificatesUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordModuleCompletionUseCase;
import com.nac.slogbaa.progress.application.port.in.RevokeCertificateUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordProgressUseCase;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort;
import com.nac.slogbaa.progress.application.port.out.ModuleCompletionPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.application.service.EnrollTraineeService;
import com.nac.slogbaa.progress.application.service.GetLeaderboardService;
import com.nac.slogbaa.progress.application.service.IssueCertificateService;
import com.nac.slogbaa.progress.application.service.ListCertificatesService;
import com.nac.slogbaa.progress.application.service.RevokeCertificateService;
import com.nac.slogbaa.progress.application.service.GetEnrolledCoursesService;
import com.nac.slogbaa.progress.application.service.GetResumePointService;
import com.nac.slogbaa.progress.application.service.RecordModuleCompletionService;
import com.nac.slogbaa.progress.application.service.RecordProgressService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProgressConfiguration {

    @Bean
    public EnrollTraineeUseCase enrollTraineeUseCase(
            CoursePublicationPort coursePublicationPort,
            TraineeProgressRepositoryPort traineeProgressRepository) {
        return new EnrollTraineeService(coursePublicationPort, traineeProgressRepository);
    }

    @Bean
    public GetEnrolledCoursesUseCase getEnrolledCoursesUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository,
            CourseSummaryQueryPort courseSummaryQueryPort) {
        return new GetEnrolledCoursesService(traineeProgressRepository, courseSummaryQueryPort);
    }

    @Bean
    public RecordModuleCompletionUseCase recordModuleCompletionUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository,
            ModuleCompletionPort moduleCompletionPort,
            CourseDetailsQueryPort courseDetailsQueryPort,
            IssueCertificateUseCase issueCertificateUseCase) {
        return new RecordModuleCompletionService(traineeProgressRepository, moduleCompletionPort, courseDetailsQueryPort, issueCertificateUseCase);
    }

    @Bean
    public IssueCertificateUseCase issueCertificateUseCase(
            CertificateRepositoryPort certificateRepository,
            TraineeProgressRepositoryPort traineeProgressRepository,
            CourseDetailsQueryPort courseDetailsQueryPort,
            TraineeCourseQuizScorePort traineeCourseQuizScorePort,
            GetTraineeByIdUseCase getTraineeByIdUseCase,
            CertificatePdfGeneratorPort pdfGenerator,
            FileStoragePort fileStorage,
            com.nac.slogbaa.progress.application.port.out.TraineeSettingsPort traineeSettingsPort,
            TraineeNotificationPort traineeNotificationPort) {
        return new IssueCertificateService(certificateRepository, traineeProgressRepository, courseDetailsQueryPort,
                traineeCourseQuizScorePort, getTraineeByIdUseCase, pdfGenerator, fileStorage, traineeSettingsPort, traineeNotificationPort);
    }

    @Bean
    public RecordProgressUseCase recordProgressUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository,
            CourseDetailsQueryPort courseDetailsQueryPort,
            RecordModuleCompletionUseCase recordModuleCompletionUseCase) {
        return new RecordProgressService(traineeProgressRepository, courseDetailsQueryPort, recordModuleCompletionUseCase);
    }

    @Bean
    public GetResumePointUseCase getResumePointUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository) {
        return new GetResumePointService(traineeProgressRepository);
    }

    @Bean
    public ListCertificatesUseCase listCertificatesUseCase(
            CertificateRepositoryPort certificateRepository) {
        return new ListCertificatesService(certificateRepository);
    }

    @Bean
    public RevokeCertificateUseCase revokeCertificateUseCase(
            CertificateRepositoryPort certificateRepository) {
        return new RevokeCertificateService(certificateRepository);
    }

    @Bean
    public GetLeaderboardUseCase getLeaderboardUseCase(
            TraineeProgressRepositoryPort traineeProgressRepository,
            GetTraineeByIdUseCase getTraineeByIdUseCase) {
        return new GetLeaderboardService(traineeProgressRepository, getTraineeByIdUseCase);
    }
}
