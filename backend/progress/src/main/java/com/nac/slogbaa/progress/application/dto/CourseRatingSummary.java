package com.nac.slogbaa.progress.application.dto;

/**
 * Summary DTO for course rating (average + total count).
 */
public record CourseRatingSummary(
        double averageRating,
        long totalReviews
) {}
