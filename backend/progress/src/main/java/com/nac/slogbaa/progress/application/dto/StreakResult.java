package com.nac.slogbaa.progress.application.dto;

import java.time.LocalDate;

/**
 * Result DTO for streak data returned to the client.
 */
public record StreakResult(
        int currentStreak,
        int longestStreak,
        LocalDate lastActiveDate,
        int dailyGoalMinutes,
        int todayMinutes,
        boolean goalMet
) {}
