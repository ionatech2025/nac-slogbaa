package com.nac.slogbaa.progress.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Persistence entity for module-level completion (table module_progress).
 * Course is complete when all modules have a COMPLETED row for that trainee's progress.
 */
@Entity
@Table(name = "module_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uq_module_progress_progress_module", columnNames = {"trainee_progress_id", "module_id"})
}, indexes = {
        @Index(name = "idx_module_progress_trainee_progress", columnList = "trainee_progress_id"),
        @Index(name = "idx_module_progress_module", columnList = "module_id")
})
public class ModuleProgressEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainee_progress_id", nullable = false, updatable = false)
    private TraineeProgressEntity traineeProgress;

    @Column(name = "module_id", nullable = false, updatable = false)
    private UUID moduleId;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "quiz_status", nullable = false, length = 30)
    private String quizStatus = "NOT_ATTEMPTED";

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
    public TraineeProgressEntity getTraineeProgress() { return traineeProgress; }
    public void setTraineeProgress(TraineeProgressEntity traineeProgress) { this.traineeProgress = traineeProgress; }
    public UUID getModuleId() { return moduleId; }
    public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public String getQuizStatus() { return quizStatus; }
    public void setQuizStatus(String quizStatus) { this.quizStatus = quizStatus; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
