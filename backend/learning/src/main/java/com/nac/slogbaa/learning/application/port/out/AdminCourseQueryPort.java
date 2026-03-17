package com.nac.slogbaa.learning.application.port.out;

import com.nac.slogbaa.learning.application.dto.result.AdminCourseSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port for admin course queries (all courses, including unpublished).
 */
public interface AdminCourseQueryPort {

    List<AdminCourseSummary> findAllCourses();

    Page<AdminCourseSummary> findAllCourses(Pageable pageable);

    long countAllCourses();

    Optional<CourseDetails> findCourseDetailsByIdForAdmin(UUID courseId);

    /**
     * Find the category ID for a given course (used by clone).
     */
    Optional<UUID> findCategoryIdByCourseId(UUID courseId);
}
