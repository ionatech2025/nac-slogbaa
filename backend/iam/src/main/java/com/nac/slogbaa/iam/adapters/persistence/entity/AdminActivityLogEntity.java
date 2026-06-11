package com.nac.slogbaa.iam.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "admin_activity_log")
public class AdminActivityLogEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "actor_id")
    private UUID actorId;

    @Column(name = "actor_email", nullable = false)
    private String actorEmail;

    @Column(name = "actor_role", nullable = false)
    private String actorRole;

    @Column(name = "action_type", nullable = false)
    private String actionType;

    @Column(name = "target_id")
    private String targetId;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public AdminActivityLogEntity() {}

    public AdminActivityLogEntity(UUID actorId, String actorEmail, String actorRole, String actionType, String targetId, String description) {
        this.actorId = actorId;
        this.actorEmail = actorEmail;
        this.actorRole = actorRole;
        this.actionType = actionType;
        this.targetId = targetId;
        this.description = description;
    }

    public UUID getId() { return id; }
    public UUID getActorId() { return actorId; }
    public String getActorEmail() { return actorEmail; }
    public String getActorRole() { return actorRole; }
    public String getActionType() { return actionType; }
    public String getTargetId() { return targetId; }
    public String getDescription() { return description; }
    public Instant getCreatedAt() { return createdAt; }
}
