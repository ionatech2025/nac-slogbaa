package com.nac.slogbaa.progress.application.port.out;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Port for streak and daily activity persistence.
 */
public interface StreakPort {

    /**
     * Record (upsert) activity minutes for a trainee on a given date.
     * If a row already exists, increments minutes_spent by the given amount.
     */
    void recordActivity(UUID traineeId, LocalDate date, int minutes);

    /**
     * Get the current streak data for a trainee. Returns null fields if no streak row exists yet.
     */
    StreakData getStreak(UUID traineeId);

    /**
     * Get daily activity minutes for a trainee on a specific date.
     * Returns 0 if no activity recorded.
     */
    int getDailyActivityMinutes(UUID traineeId, LocalDate date);

    /**
     * Update the daily goal (in minutes) for a trainee.
     */
    void updateDailyGoal(UUID traineeId, int minutes);

    /**
     * Update streak counters after recording activity.
     */
    void updateStreak(UUID traineeId, int currentStreak, int longestStreak, LocalDate lastActiveDate);

    /**
     * Immutable carrier for streak data from persistence.
     */
    record StreakData(int currentStreak, int longestStreak, LocalDate lastActiveDate, int dailyGoalMinutes) {}
}
