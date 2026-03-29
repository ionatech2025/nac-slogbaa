package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.port.in.CheckAndAwardBadgesUseCase;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;
import com.nac.slogbaa.progress.application.port.out.BadgePort;
import com.nac.slogbaa.progress.application.port.out.StreakPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.application.port.out.XpPort;
import com.nac.slogbaa.progress.core.aggregate.TraineeProgress;

import java.util.List;
import java.util.UUID;

/**
 * Checks trigger conditions and awards badges + XP if the trainee hasn't already earned them.
 */
public final class CheckAndAwardBadgesService implements CheckAndAwardBadgesUseCase {

    private final BadgePort badgePort;
    private final XpPort xpPort;
    private final TraineeProgressRepositoryPort traineeProgressRepository;
    private final StreakPort streakPort;
    private final CreateNotificationUseCase createNotificationUseCase;

    public CheckAndAwardBadgesService(BadgePort badgePort,
                                       XpPort xpPort,
                                       TraineeProgressRepositoryPort traineeProgressRepository,
                                       StreakPort streakPort,
                                       CreateNotificationUseCase createNotificationUseCase) {
        this.badgePort = badgePort;
        this.xpPort = xpPort;
        this.traineeProgressRepository = traineeProgressRepository;
        this.streakPort = streakPort;
        this.createNotificationUseCase = createNotificationUseCase;
    }

    @Override
    public void checkAndAward(UUID traineeId, String triggerType) {
        List<BadgePort.BadgeData> allDefs = badgePort.getAllDefinitions();

        for (BadgePort.BadgeData def : allDefs) {
            if (!def.triggerType().equals(triggerType)) continue;
            if (badgePort.hasTraineeBadge(traineeId, def.id())) continue;

            if (isTriggerConditionMet(traineeId, triggerType)) {
                boolean awarded = badgePort.awardBadge(traineeId, def.id());
                if (awarded) {
                    if (def.xpReward() > 0) {
                        xpPort.addXp(traineeId, def.xpReward());
                    }
                    try {
                        createNotificationUseCase.createForTrainee(
                                traineeId,
                                "BADGE_AWARDED",
                                "Badge Earned!",
                                "You earned the '" + def.name() + "' badge!",
                                "/dashboard"
                        );
                    } catch (Exception ignored) {
                        // Notification must never break the badge flow
                    }
                }
            }
        }
    }

    @Override
    public void checkPerfectQuiz(UUID traineeId, boolean passed, int score) {
        if (!passed || score < 100) return;
        checkAndAward(traineeId, "PERFECT_QUIZ");
    }

    @Override
    public void checkStreakBadges(UUID traineeId) {
        StreakPort.StreakData streakData = streakPort.getStreak(traineeId);
        int currentStreak = streakData.currentStreak();

        if (currentStreak >= 7) {
            checkAndAward(traineeId, "STREAK_7");
        }
        if (currentStreak >= 30) {
            checkAndAward(traineeId, "STREAK_30");
        }
    }

    private boolean isTriggerConditionMet(UUID traineeId, String triggerType) {
        return switch (triggerType) {
            case "FIRST_ENROLLMENT" -> {
                List<TraineeProgress> enrollments = traineeProgressRepository.findByTraineeId(traineeId);
                yield !enrollments.isEmpty();
            }
            case "FIRST_COMPLETION" -> {
                long completedCount = countCompletedCourses(traineeId);
                yield completedCount >= 1;
            }
            case "COURSES_COMPLETED_3" -> {
                long completedCount = countCompletedCourses(traineeId);
                yield completedCount >= 3;
            }
            case "COURSES_COMPLETED_5" -> {
                long completedCount = countCompletedCourses(traineeId);
                yield completedCount >= 5;
            }
            case "STREAK_7" -> {
                StreakPort.StreakData data = streakPort.getStreak(traineeId);
                yield data.currentStreak() >= 7;
            }
            case "STREAK_30" -> {
                StreakPort.StreakData data = streakPort.getStreak(traineeId);
                yield data.currentStreak() >= 30;
            }
            case "PERFECT_QUIZ" -> true; // Already checked by caller
            case "REVIEW_WRITTEN" -> true; // Already checked by caller (only called after review submission)
            default -> false;
        };
    }

    private long countCompletedCourses(UUID traineeId) {
        return traineeProgressRepository.findByTraineeId(traineeId).stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .count();
    }
}
