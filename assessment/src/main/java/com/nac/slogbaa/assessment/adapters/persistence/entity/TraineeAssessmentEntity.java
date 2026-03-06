package com.nac.slogbaa.assessment.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "trainee_assessment", uniqueConstraints = {
        @UniqueConstraint(name = "uq_trainee_assessment_trainee_quiz", columnNames = {"trainee_id", "quiz_id"})
}, indexes = {
        @Index(name = "idx_trainee_assessment_trainee", columnList = "trainee_id"),
        @Index(name = "idx_trainee_assessment_quiz", columnList = "quiz_id")
})
public class TraineeAssessmentEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "trainee_id", nullable = false, updatable = false)
    private UUID traineeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false, updatable = false)
    private QuizEntity quiz;

    @Column(name = "module_id", nullable = false, updatable = false)
    private UUID moduleId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "traineeAssessment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAttemptEntity> attempts = new ArrayList<>();

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
    public QuizEntity getQuiz() { return quiz; }
    public void setQuiz(QuizEntity quiz) { this.quiz = quiz; }
    public UUID getModuleId() { return moduleId; }
    public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public List<QuizAttemptEntity> getAttempts() { return attempts; }
    public void setAttempts(List<QuizAttemptEntity> attempts) { this.attempts = attempts != null ? attempts : new ArrayList<>(); }
}
