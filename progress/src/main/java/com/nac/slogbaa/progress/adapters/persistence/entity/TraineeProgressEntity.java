package com.nac.slogbaa.progress.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "trainee_progress", indexes = {
        @Index(name = "idx_trainee_progress_trainee", columnList = "trainee_id"),
        @Index(name = "idx_trainee_progress_course", columnList = "course_id"),
        @Index(name = "idx_trainee_progress_status", columnList = "status")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_trainee_progress_trainee_course", columnNames = {"trainee_id", "course_id"})
})
public class TraineeProgressEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "trainee_id", nullable = false, updatable = false)
    private UUID traineeId;

    @Column(name = "course_id", nullable = false, updatable = false)
    private UUID courseId;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "completion_percentage", nullable = false)
    private int completionPercentage = 0;

    @Column(name = "last_module_id")
    private UUID lastModuleId;

    @Column(name = "last_content_block_id")
    private UUID lastContentBlockId;

    @Column(name = "last_accessed_at")
    private Instant lastAccessedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
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
    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
    public LocalDate getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDate enrollmentDate) { this.enrollmentDate = enrollmentDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }
    public UUID getLastModuleId() { return lastModuleId; }
    public void setLastModuleId(UUID lastModuleId) { this.lastModuleId = lastModuleId; }
    public UUID getLastContentBlockId() { return lastContentBlockId; }
    public void setLastContentBlockId(UUID lastContentBlockId) { this.lastContentBlockId = lastContentBlockId; }
    public Instant getLastAccessedAt() { return lastAccessedAt; }
    public void setLastAccessedAt(Instant lastAccessedAt) { this.lastAccessedAt = lastAccessedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
