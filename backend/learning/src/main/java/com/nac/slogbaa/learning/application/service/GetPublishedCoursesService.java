package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.result.CourseSummary;
import com.nac.slogbaa.learning.application.port.in.GetPublishedCoursesUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseRepositoryPort;
import com.nac.slogbaa.learning.core.aggregate.Course;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nac.slogbaa.shared.ports.GetCourseReviewSummaryPort;

/**
 * Application service: list published courses.
 */
public final class GetPublishedCoursesService implements GetPublishedCoursesUseCase {

    private final CourseRepositoryPort courseRepository;
    private final GetCourseReviewSummaryPort getCourseReviewSummaryPort;

    public GetPublishedCoursesService(CourseRepositoryPort courseRepository,
                                      GetCourseReviewSummaryPort getCourseReviewSummaryPort) {
        this.courseRepository = courseRepository;
        this.getCourseReviewSummaryPort = getCourseReviewSummaryPort;
    }

    @Override
    public List<CourseSummary> getPublishedCourses() {
        return courseRepository.findPublishedCourses().stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    public Page<CourseSummary> getPublishedCourses(Pageable pageable) {
        return courseRepository.findPublishedCourses(pageable)
                .map(this::toSummary);
    }

    private CourseSummary toSummary(Course c) {
        GetCourseReviewSummaryPort.ReviewSummary rs = getCourseReviewSummaryPort.getSummary(c.getId().getValue());
        double avg = rs != null ? rs.averageRating() : 0.0;
        long total = rs != null ? rs.totalReviews() : 0;
        return new CourseSummary(
                c.getId().getValue(),
                c.getTitle(),
                c.getDescription(),
                c.getImageUrl(),
                c.getModuleCount(),
                c.getTotalEstimatedMinutes(),
                c.getCategoryName(),
                c.getCategorySlug(),
                c.getCategoryId(),
                c.getPrerequisiteCourseId(),
                c.getPrerequisiteCourseName(),
                avg,
                total
        );
    }
}
