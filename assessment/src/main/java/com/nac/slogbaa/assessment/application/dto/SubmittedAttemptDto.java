package com.nac.slogbaa.assessment.application.dto;

import java.time.Instant;
import java.util.UUID;

/** Result after submitting an attempt. */
public record SubmittedAttemptDto(
        UUID attemptId,
        int pointsEarned,
        int totalPoints,
        int percentScore,
        boolean passed,
        Instant completedAt
) {}
