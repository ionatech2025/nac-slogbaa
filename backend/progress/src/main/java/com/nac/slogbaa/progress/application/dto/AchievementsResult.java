package com.nac.slogbaa.progress.application.dto;

import java.util.List;

/**
 * Result DTO for the trainee achievements endpoint.
 * Contains total XP, earned badges, and all available badges.
 */
public record AchievementsResult(
        int totalXp,
        List<BadgeResult> earnedBadges,
        List<BadgeResult> allBadges
) {}
