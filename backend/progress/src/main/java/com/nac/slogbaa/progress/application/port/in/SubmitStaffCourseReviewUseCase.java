package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Submit or update a staff course review. Course must exist and be published.
 */
public interface SubmitStaffCourseReviewUseCase {

    void submit(UUID staffUserId, UUID courseId, int rating, String reviewText);
}
