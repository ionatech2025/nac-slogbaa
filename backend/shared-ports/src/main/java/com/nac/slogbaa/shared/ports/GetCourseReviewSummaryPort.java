package com.nac.slogbaa.shared.ports;

import java.util.UUID;

public interface GetCourseReviewSummaryPort {
    ReviewSummary getSummary(UUID courseId);

    record ReviewSummary(double averageRating, long totalReviews) {}
}
