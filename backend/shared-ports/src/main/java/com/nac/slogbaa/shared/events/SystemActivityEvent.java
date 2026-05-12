package com.nac.slogbaa.shared.events;

import java.util.UUID;

public class SystemActivityEvent {
    private final UUID actorId;
    private final String actorRole;
    private final String actionType;
    private final String targetId;
    private final String description;

    public SystemActivityEvent(UUID actorId, String actorRole, String actionType, String targetId, String description) {
        this.actorId = actorId;
        this.actorRole = actorRole;
        this.actionType = actionType;
        this.targetId = targetId;
        this.description = description;
    }

    public UUID getActorId() { return actorId; }
    public String getActorRole() { return actorRole; }
    public String getActionType() { return actionType; }
    public String getTargetId() { return targetId; }
    public String getDescription() { return description; }
}
