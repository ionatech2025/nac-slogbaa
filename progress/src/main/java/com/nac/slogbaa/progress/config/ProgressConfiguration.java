package com.nac.slogbaa.progress.config;

import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.learning.application.port.out.CourseSummaryQueryPort;
import com.nac.slogbaa.progress.application.port.in.EnrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.application.service.EnrollTraineeService;
import com.nac.slogbaa.progress.application.service.GetEnrolledCoursesService;
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
}
