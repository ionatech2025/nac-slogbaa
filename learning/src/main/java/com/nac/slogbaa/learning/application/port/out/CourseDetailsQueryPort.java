package com.nac.slogbaa.learning.application.port.out;

import com.nac.slogbaa.learning.application.dto.result.CourseDetails;

import java.util.Optional;
import java.util.UUID;

/**
 * Port for querying full course details.
 */
public interface CourseDetailsQueryPort {

    /** Published courses only (for trainees). */
    Optional<CourseDetails> findCourseDetailsById(UUID courseId);

    /** Any course by id (for internal use e.g. certificate issuance). */
    Optional<CourseDetails> findCourseDetailsByIdIncludingUnpublished(UUID courseId);
}
