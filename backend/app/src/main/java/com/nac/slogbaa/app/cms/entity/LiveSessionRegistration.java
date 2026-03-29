package com.nac.slogbaa.app.cms.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "live_session_registration",
    uniqueConstraints = @UniqueConstraint(name = "uq_live_session_registration", columnNames = { "live_session_id", "trainee_id" })
)
@Access(AccessType.FIELD)
public class LiveSessionRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "live_session_id", nullable = false)
    private UUID liveSessionId;

    @Column(name = "trainee_id", nullable = false)
    private UUID traineeId;

    @Column(name = "registered_at", nullable = false)
    private Instant registeredAt = Instant.now();

    @PrePersist
    void onCreate() {
        if (registeredAt == null) registeredAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public UUID getLiveSessionId() {
        return liveSessionId;
    }

    public void setLiveSessionId(UUID liveSessionId) {
        this.liveSessionId = liveSessionId;
    }

    public UUID getTraineeId() {
        return traineeId;
    }

    public void setTraineeId(UUID traineeId) {
        this.traineeId = traineeId;
    }

    public Instant getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(Instant registeredAt) {
        this.registeredAt = registeredAt;
    }
}
