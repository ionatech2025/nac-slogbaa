package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.dto.StreakResult;
import com.nac.slogbaa.progress.application.port.in.CheckAndAwardBadgesUseCase;
import com.nac.slogbaa.progress.application.port.in.GetStreakUseCase;
import com.nac.slogbaa.progress.application.port.out.StreakPort;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Returns streak data including today's progress toward the daily goal.
 */
public final class GetStreakService implements GetStreakUseCase {

    private final StreakPort streakPort;
    private final CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase;

    public GetStreakService(StreakPort streakPort, CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase) {
        this.streakPort = streakPort;
        this.checkAndAwardBadgesUseCase = checkAndAwardBadgesUseCase;
    }

    @Override
    public StreakResult getStreak(UUID traineeId) {
        StreakPort.StreakData data = streakPort.getStreak(traineeId);
        LocalDate today = LocalDate.now();
        int todayMinutes = streakPort.getDailyActivityMinutes(traineeId, today);
        boolean goalMet = todayMinutes >= data.dailyGoalMinutes();

        // Check streak-based badges (non-blocking)
        try {
            checkAndAwardBadgesUseCase.checkStreakBadges(traineeId);
        } catch (Exception ignored) {
            // Badge checks must never break the main streak flow
        }

        return new StreakResult(
                data.currentStreak(),
                data.longestStreak(),
                data.lastActiveDate(),
                data.dailyGoalMinutes(),
                todayMinutes,
                goalMet
        );
    }
}
