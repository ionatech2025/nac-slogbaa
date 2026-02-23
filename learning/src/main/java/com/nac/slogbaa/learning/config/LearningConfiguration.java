package com.nac.slogbaa.learning.config;

import com.nac.slogbaa.learning.application.port.in.GetPublishedCoursesUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseRepositoryPort;
import com.nac.slogbaa.learning.application.service.GetPublishedCoursesService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LearningConfiguration {

    @Bean
    public GetPublishedCoursesUseCase getPublishedCoursesUseCase(CourseRepositoryPort courseRepository) {
        return new GetPublishedCoursesService(courseRepository);
    }
}
