package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.result.CourseDetails;

import java.util.Optional;
import java.util.UUID;

/**
 * Use case: get full course details for admin (including unpublished).
 */
public interface GetAdminCourseDetailsUseCase {

    Optional<CourseDetails> getById(UUID courseId);
}
