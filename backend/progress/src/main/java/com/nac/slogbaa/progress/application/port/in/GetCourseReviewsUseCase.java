package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.CourseRatingSummary;
import com.nac.slogbaa.progress.application.dto.CourseReviewResult;

import java.util.List;
import java.util.UUID;

/**
 * Use case: retrieve course reviews and rating summary.
 */
public interface GetCourseReviewsUseCase {

    List<CourseReviewResult> getReviews(UUID courseId);

    CourseRatingSummary getRatingSummary(UUID courseId);

    void deleteReview(UUID traineeId, UUID courseId);
}
