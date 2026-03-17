package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.StreakResult;

import java.util.UUID;

/**
 * Use case: get current streak data for a trainee.
 */
public interface GetStreakUseCase {

    StreakResult getStreak(UUID traineeId);
}
