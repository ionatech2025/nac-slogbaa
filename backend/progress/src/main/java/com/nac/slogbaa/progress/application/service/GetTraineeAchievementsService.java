package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.dto.AchievementsResult;
import com.nac.slogbaa.progress.application.dto.BadgeResult;
import com.nac.slogbaa.progress.application.port.in.GetTraineeAchievementsUseCase;
import com.nac.slogbaa.progress.application.port.out.BadgePort;
import com.nac.slogbaa.progress.application.port.out.XpPort;

import java.time.Instant;
import java.util.*;

/**
 * Returns badges earned + total XP for a trainee.
 */
public final class GetTraineeAchievementsService implements GetTraineeAchievementsUseCase {

    private final BadgePort badgePort;
    private final XpPort xpPort;

    public GetTraineeAchievementsService(BadgePort badgePort, XpPort xpPort) {
        this.badgePort = badgePort;
        this.xpPort = xpPort;
    }

    @Override
    public AchievementsResult getAchievements(UUID traineeId) {
        List<BadgePort.BadgeData> allDefs = badgePort.getAllDefinitions();
        List<BadgePort.TraineeBadgeData> earnedBadges = badgePort.getTraineeBadges(traineeId);
        int totalXp = xpPort.getXp(traineeId);

        // Map badgeId -> awardedAt for quick lookup
        Map<UUID, Instant> earnedMap = new HashMap<>();
        for (BadgePort.TraineeBadgeData tb : earnedBadges) {
            earnedMap.put(tb.badgeId(), tb.awardedAt());
        }

        List<BadgeResult> earned = new ArrayList<>();
        List<BadgeResult> all = new ArrayList<>();

        for (BadgePort.BadgeData def : allDefs) {
            Instant awardedAt = earnedMap.get(def.id());
            boolean isEarned = awardedAt != null;
            BadgeResult result = new BadgeResult(
                    def.id(), def.name(), def.description(), def.iconName(),
                    def.xpReward(), isEarned, awardedAt
            );
            all.add(result);
            if (isEarned) {
                earned.add(result);
            }
        }

        return new AchievementsResult(totalXp, earned, all);
    }
}
