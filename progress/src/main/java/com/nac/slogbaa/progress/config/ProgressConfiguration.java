package com.nac.slogbaa.progress.config;

import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.learning.application.port.out.CourseSummaryQueryPort;
import com.nac.slogbaa.progress.application.port.in.EnrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.in.GetResumePointUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordModuleCompletionUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordProgressUseCase;
import com.nac.slogbaa.progress.application.port.out.ModuleCompletionPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.application.service.EnrollTraineeService;
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
            CourseDetailsQueryPort courseDetailsQueryPort) {
        return new RecordModuleCompletionService(traineeProgressRepository, moduleCompletionPort, courseDetailsQueryPort);
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
}
