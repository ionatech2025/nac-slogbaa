package com.nac.slogbaa.progress.application.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.UUID;

/**
 * Result DTO for a single course review (trainee or staff).
 */
public record CourseReviewResult(
        UUID id,
        @JsonProperty("authorDisplayName")
        @JsonAlias("traineeDisplayName")
        String authorDisplayName,
        String authorType,
        int rating,
        String reviewText,
        Instant createdAt
) {}
