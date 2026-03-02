package com.nac.slogbaa.learning.config;

import com.nac.slogbaa.learning.application.port.in.CreateLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.in.GetAdminLibraryResourcesUseCase;
import com.nac.slogbaa.learning.application.port.in.GetCourseDetailsUseCase;
import com.nac.slogbaa.learning.application.port.in.GetPublishedLibraryResourcesUseCase;
import com.nac.slogbaa.learning.application.port.in.GetPublishedCoursesUseCase;
import com.nac.slogbaa.learning.application.port.in.PublishLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.learning.application.port.out.CourseRepositoryPort;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceQueryPort;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceWritePort;
import com.nac.slogbaa.learning.application.service.CreateLibraryResourceService;
import com.nac.slogbaa.learning.application.service.GetAdminLibraryResourcesService;
import com.nac.slogbaa.learning.application.service.GetCourseDetailsService;
import com.nac.slogbaa.learning.application.service.GetPublishedLibraryResourcesService;
import com.nac.slogbaa.learning.application.service.GetPublishedCoursesService;
import com.nac.slogbaa.learning.application.service.PublishLibraryResourceService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LearningConfiguration {

    @Bean
    public GetPublishedCoursesUseCase getPublishedCoursesUseCase(CourseRepositoryPort courseRepository) {
        return new GetPublishedCoursesService(courseRepository);
    }

    @Bean
    public GetCourseDetailsUseCase getCourseDetailsUseCase(CourseDetailsQueryPort courseDetailsQueryPort) {
        return new GetCourseDetailsService(courseDetailsQueryPort);
    }

    @Bean
    public GetPublishedLibraryResourcesUseCase getPublishedLibraryResourcesUseCase(LibraryResourceQueryPort libraryResourceQueryPort) {
        return new GetPublishedLibraryResourcesService(libraryResourceQueryPort);
    }

    @Bean
    public GetAdminLibraryResourcesUseCase getAdminLibraryResourcesUseCase(LibraryResourceWritePort libraryResourceWritePort) {
        return new GetAdminLibraryResourcesService(libraryResourceWritePort);
    }

    @Bean
    public CreateLibraryResourceUseCase createLibraryResourceUseCase(LibraryResourceWritePort libraryResourceWritePort) {
        return new CreateLibraryResourceService(libraryResourceWritePort);
    }

    @Bean
    public PublishLibraryResourceUseCase publishLibraryResourceUseCase(LibraryResourceWritePort libraryResourceWritePort) {
        return new PublishLibraryResourceService(libraryResourceWritePort);
    }
}
