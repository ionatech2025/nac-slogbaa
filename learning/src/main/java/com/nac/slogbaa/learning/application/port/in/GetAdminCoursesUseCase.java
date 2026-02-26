package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.result.AdminCourseSummary;

import java.util.List;

/**
 * Use case: list all courses for admin (including unpublished).
 */
public interface GetAdminCoursesUseCase {

    List<AdminCourseSummary> getAllCourses();
}
