package com.nac.slogbaa.progress.application.port.out;

import java.util.UUID;

/**
 * Port for trainee XP persistence operations.
 */
public interface XpPort {

    /**
     * Get the total XP for a trainee. Returns 0 if no record exists.
     */
    int getXp(UUID traineeId);

    /**
     * Add XP to a trainee's total. Creates record if it doesn't exist.
     */
    void addXp(UUID traineeId, int amount);
}
