package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: enroll a trainee in a course. Creates a trainee_progress record.
 * Caller must ensure the authenticated user is the trainee (TRAINEE role).
 */
public interface EnrollTraineeUseCase {

    /**
     * Enroll the given trainee in the given course.
     * Validates that the course exists and is published (via Learning port).
     * Idempotent: if already enrolled, throws AlreadyEnrolledException.
     *
     * @param traineeId current trainee (from auth)
     * @param courseId  course to enroll in
     * @throws com.nac.slogbaa.progress.core.exception.CourseNotPublishedException if course not found or not published
     * @throws com.nac.slogbaa.progress.core.exception.AlreadyEnrolledException     if trainee already enrolled
     */
    void enroll(UUID traineeId, UUID courseId);
}
