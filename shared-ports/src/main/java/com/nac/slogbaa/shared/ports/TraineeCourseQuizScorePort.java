package com.nac.slogbaa.shared.ports;

import java.util.Optional;
import java.util.UUID;

/**
 * Port for querying a trainee's best quiz score for a course.
 * Implemented by the assessment module.
 */
public interface TraineeCourseQuizScorePort {

    /**
     * Get the best passed quiz score (as percent) for the trainee on the course.
     * Returns empty if the trainee has no passed quiz attempts for the course.
     */
    Optional<Integer> getBestPassedScorePercent(UUID traineeId, UUID courseId);
}
