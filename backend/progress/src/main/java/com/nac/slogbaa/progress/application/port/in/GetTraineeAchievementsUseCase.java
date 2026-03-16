package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.AchievementsResult;

import java.util.UUID;

/**
 * Use case: get all achievements (badges + XP) for a trainee.
 */
public interface GetTraineeAchievementsUseCase {

    AchievementsResult getAchievements(UUID traineeId);
}
