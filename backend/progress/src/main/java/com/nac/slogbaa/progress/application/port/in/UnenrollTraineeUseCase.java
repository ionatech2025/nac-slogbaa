package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: unenroll (withdraw) a trainee from a course.
 * Sets the trainee_progress status to WITHDRAWN rather than deleting (preserves history).
 * Caller must ensure the authenticated user is the trainee (TRAINEE role).
 */
public interface UnenrollTraineeUseCase {

    /**
     * Withdraw the given trainee from the given course.
     * Idempotent: if already withdrawn or not enrolled, this is a no-op.
     *
     * @param traineeId current trainee (from auth)
     * @param courseId  course to leave
     */
    void unenroll(UUID traineeId, UUID courseId);
}
