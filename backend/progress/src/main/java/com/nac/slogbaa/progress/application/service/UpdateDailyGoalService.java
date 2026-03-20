package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.port.in.UpdateDailyGoalUseCase;
import com.nac.slogbaa.progress.application.port.out.StreakPort;

import java.util.UUID;

/**
 * Updates the trainee's daily learning goal (in minutes).
 */
public final class UpdateDailyGoalService implements UpdateDailyGoalUseCase {

    private final StreakPort streakPort;

    public UpdateDailyGoalService(StreakPort streakPort) {
        this.streakPort = streakPort;
    }

    @Override
    public void update(UUID traineeId, int minutes) {
        if (minutes < 1) {
            minutes = 1;
        }
        streakPort.updateDailyGoal(traineeId, minutes);
    }
}
