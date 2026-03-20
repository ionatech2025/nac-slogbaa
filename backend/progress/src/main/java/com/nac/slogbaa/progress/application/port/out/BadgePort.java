package com.nac.slogbaa.progress.application.port.out;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Port for badge persistence operations.
 */
public interface BadgePort {

    /**
     * Returns all badge definitions.
     */
    List<BadgeData> getAllDefinitions();

    /**
     * Returns all badges earned by a trainee.
     */
    List<TraineeBadgeData> getTraineeBadges(UUID traineeId);

    /**
     * Awards a badge to a trainee. Returns true if newly awarded, false if already held.
     */
    boolean awardBadge(UUID traineeId, UUID badgeId);

    /**
     * Checks if a trainee already has a specific badge.
     */
    boolean hasTraineeBadge(UUID traineeId, UUID badgeId);

    /**
     * Immutable carrier for badge definition data.
     */
    record BadgeData(UUID id, String name, String description, String iconName, String triggerType, int xpReward) {}

    /**
     * Immutable carrier for a trainee's earned badge.
     */
    record TraineeBadgeData(UUID badgeId, Instant awardedAt) {}
}
