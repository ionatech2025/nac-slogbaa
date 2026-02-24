package com.nac.slogbaa.learning.application.port.out;

import com.nac.slogbaa.learning.application.dto.result.CourseDetails;

import java.util.Optional;
import java.util.UUID;

/**
 * Port for querying full course details (published only).
 */
public interface CourseDetailsQueryPort {

    Optional<CourseDetails> findCourseDetailsById(UUID courseId);
}
