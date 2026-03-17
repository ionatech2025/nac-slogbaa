package com.nac.slogbaa.config;

import com.nac.slogbaa.iam.application.port.in.ExportTraineeDataUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.progress.application.port.in.GetBookmarksUseCase;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.out.CourseReviewPort;
import com.nac.slogbaa.service.ExportTraineeDataService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wires cross-module GDPR services (data export spans IAM + Progress).
 */
@Configuration
public class GdprConfiguration {

    @Bean
    public ExportTraineeDataUseCase exportTraineeDataUseCase(
            GetTraineeByIdUseCase getTraineeByIdUseCase,
            GetEnrolledCoursesUseCase getEnrolledCoursesUseCase,
            GetBookmarksUseCase getBookmarksUseCase,
            CourseReviewPort courseReviewPort) {
        return new ExportTraineeDataService(
                getTraineeByIdUseCase,
                getEnrolledCoursesUseCase,
                getBookmarksUseCase,
                courseReviewPort
        );
    }
}
