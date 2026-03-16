package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: check badge trigger conditions and award badges + XP if eligible.
 * All methods are designed to be non-blocking — callers should wrap in try/catch.
 */
public interface CheckAndAwardBadgesUseCase {

    /**
     * Check and award badges for a specific trigger type.
     * @param traineeId the trainee to check
     * @param triggerType the trigger type (e.g. FIRST_ENROLLMENT, FIRST_COMPLETION, etc.)
     */
    void checkAndAward(UUID traineeId, String triggerType);

    /**
     * Check and award the PERFECT_QUIZ badge when a quiz is passed with 100% score.
     * @param traineeId the trainee
     * @param passed whether the quiz was passed
     * @param score the quiz score percentage (0-100)
     */
    void checkPerfectQuiz(UUID traineeId, boolean passed, int score);

    /**
     * Check streak-based badges (STREAK_7, STREAK_30).
     * @param traineeId the trainee
     */
    void checkStreakBadges(UUID traineeId);
}
