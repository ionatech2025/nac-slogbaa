package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.learning.application.dto.result.CourseSummary;

import java.util.List;
import java.util.UUID;

/**
 * Use case: get list of courses the trainee is enrolled in (as course summaries).
 */
public interface GetEnrolledCoursesUseCase {

    List<CourseSummary> getEnrolledCourses(UUID traineeId);
}
