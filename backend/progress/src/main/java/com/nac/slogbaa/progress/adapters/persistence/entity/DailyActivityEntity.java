package com.nac.slogbaa.progress.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "daily_activity", uniqueConstraints = {
        @UniqueConstraint(name = "uq_daily_activity_trainee_date", columnNames = {"trainee_id", "activity_date"})
}, indexes = @Index(name = "idx_daily_activity_trainee", columnList = "trainee_id"))
public class DailyActivityEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "trainee_id", nullable = false, updatable = false)
    private UUID traineeId;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "minutes_spent", nullable = false)
    private int minutesSpent = 0;

    @Column(name = "modules_completed", nullable = false)
    private int modulesCompleted = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getTraineeId() { return traineeId; }
    public void setTraineeId(UUID traineeId) { this.traineeId = traineeId; }
    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public int getMinutesSpent() { return minutesSpent; }
    public void setMinutesSpent(int minutesSpent) { this.minutesSpent = minutesSpent; }
    public int getModulesCompleted() { return modulesCompleted; }
    public void setModulesCompleted(int modulesCompleted) { this.modulesCompleted = modulesCompleted; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
