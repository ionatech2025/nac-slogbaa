package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.result.CourseDetails;

import java.util.UUID;

/**
 * Use case: get full course details with modules and content blocks. Returns published courses only.
 */
public interface GetCourseDetailsUseCase {

    CourseDetails getById(UUID courseId);
}
