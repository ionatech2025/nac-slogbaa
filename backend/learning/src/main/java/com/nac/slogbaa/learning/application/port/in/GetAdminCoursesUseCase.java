package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.result.AdminCourseSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Use case: list all courses for admin (including unpublished).
 */
public interface GetAdminCoursesUseCase {

    List<AdminCourseSummary> getAllCourses();

    Page<AdminCourseSummary> getAllCourses(Pageable pageable);

    long countCourses();
}
