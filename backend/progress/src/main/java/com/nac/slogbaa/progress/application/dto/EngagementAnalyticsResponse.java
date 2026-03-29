package com.nac.slogbaa.progress.application.dto;

import java.util.List;

public record EngagementAnalyticsResponse(
        long traineeReviewCount,
        long staffReviewCount,
        long totalReviewCount,
        double combinedAverageRating,
        List<RatingBucketDto> ratingDistribution,
        List<DailyEngagementDto> lastSevenDays,
        Long traineeQuestionCount,
        Long totalDiscussionReplies
) {
    public record RatingBucketDto(int stars, long count) {}

    public record DailyEngagementDto(String dateKey, String label, long reviews, long questions, long replies) {}
}
