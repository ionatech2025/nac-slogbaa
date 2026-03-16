package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.result.CourseSummary;
import com.nac.slogbaa.learning.application.port.in.GetPublishedCoursesUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseRepositoryPort;
import com.nac.slogbaa.learning.core.aggregate.Course;

import java.util.List;

/**
 * Application service: list published courses.
 */
public final class GetPublishedCoursesService implements GetPublishedCoursesUseCase {

    private final CourseRepositoryPort courseRepository;

    public GetPublishedCoursesService(CourseRepositoryPort courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public List<CourseSummary> getPublishedCourses() {
        return courseRepository.findPublishedCourses().stream()
                .map(this::toSummary)
                .toList();
    }

    private CourseSummary toSummary(Course c) {
        return new CourseSummary(
                c.getId().getValue(),
                c.getTitle(),
                c.getDescription(),
                c.getImageUrl(),
                c.getModuleCount(),
                c.getTotalEstimatedMinutes(),
                c.getCategoryName(),
                c.getCategorySlug()
        );
    }
}
