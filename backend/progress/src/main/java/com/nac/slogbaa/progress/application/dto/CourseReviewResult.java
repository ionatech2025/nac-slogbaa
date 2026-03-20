package com.nac.slogbaa.progress.application.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Result DTO for a single course review.
 */
public record CourseReviewResult(
        UUID id,
        String traineeDisplayName,
        int rating,
        String reviewText,
        Instant createdAt
) {}
