package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.port.in.RecordActivityUseCase;
import com.nac.slogbaa.progress.application.port.out.StreakPort;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Records daily activity and recalculates streak counters.
 * Streak logic:
 * - If last_active_date is today, no streak change (already counted).
 * - If last_active_date is yesterday, increment current_streak.
 * - If last_active_date is null or gap > 1 day, reset current_streak to 1.
 * - Update longest_streak if current exceeds it.
 */
public final class RecordActivityService implements RecordActivityUseCase {

    private final StreakPort streakPort;

    public RecordActivityService(StreakPort streakPort) {
        this.streakPort = streakPort;
    }

    @Override
    public void record(UUID traineeId, int minutes) {
        if (minutes <= 0) {
            return;
        }

        LocalDate today = LocalDate.now();

        // Upsert daily activity
        streakPort.recordActivity(traineeId, today, minutes);

        // Recalculate streak
        StreakPort.StreakData data = streakPort.getStreak(traineeId);
        LocalDate lastActive = data.lastActiveDate();

        int currentStreak;
        if (lastActive != null && lastActive.equals(today)) {
            // Already recorded today — no streak change
            return;
        } else if (lastActive != null && lastActive.equals(today.minusDays(1))) {
            // Continuation from yesterday
            currentStreak = data.currentStreak() + 1;
        } else {
            // Gap or first activity ever
            currentStreak = 1;
        }

        int longestStreak = Math.max(data.longestStreak(), currentStreak);
        streakPort.updateStreak(traineeId, currentStreak, longestStreak, today);
    }
}
