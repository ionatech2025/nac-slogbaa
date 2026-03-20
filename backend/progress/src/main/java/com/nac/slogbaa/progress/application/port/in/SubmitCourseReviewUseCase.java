package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: submit (create or update) a course review.
 * Trainee must be enrolled in the course.
 */
public interface SubmitCourseReviewUseCase {

    /**
     * Submit a review for the given course.
     *
     * @param traineeId current trainee (from auth)
     * @param courseId  course to review
     * @param rating   1-5 star rating
     * @param reviewText optional review text
     * @throws IllegalArgumentException if rating out of range
     * @throws IllegalStateException if trainee not enrolled in course
     */
    void submit(UUID traineeId, UUID courseId, int rating, String reviewText);
}
