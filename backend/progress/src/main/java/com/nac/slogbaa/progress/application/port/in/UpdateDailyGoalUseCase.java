package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: update the daily learning goal (in minutes) for a trainee.
 */
public interface UpdateDailyGoalUseCase {

    void update(UUID traineeId, int minutes);
}
