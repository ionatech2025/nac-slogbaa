package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.EnrolledCourseResult;

import java.util.List;
import java.util.UUID;

/**
 * Use case: get list of courses the trainee is enrolled in, with progress.
 */
public interface GetEnrolledCoursesUseCase {

    List<EnrolledCourseResult> getEnrolledCourses(UUID traineeId);
}
