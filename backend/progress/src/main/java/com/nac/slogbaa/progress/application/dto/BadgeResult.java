package com.nac.slogbaa.progress.application.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Result DTO for a single badge, indicating whether the trainee has earned it.
 */
public record BadgeResult(
        UUID id,
        String name,
        String description,
        String iconName,
        int xpReward,
        boolean earned,
        Instant awardedAt
) {}
