package com.nac.slogbaa.shared.ports;

import java.util.UUID;

public interface SystemActivityLogPort {
    /**
     * Log a system activity
     *
     * @param actorId The ID of the user performing the action
     * @param actorRole The role of the user
     * @param actionType CREATE, UPDATE, DELETE, ENROLL, COMPLETE, etc.
     * @param targetId The ID of the entity being acted upon
     * @param description A human-readable description of the activity
     */
    void logActivity(UUID actorId, String actorRole, String actionType, String targetId, String description);
}
