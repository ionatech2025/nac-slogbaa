package com.nac.slogbaa.assessment.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quiz_attempt", indexes = @Index(name = "idx_quiz_attempt_assessment", columnList = "trainee_assessment_id"))
public class QuizAttemptEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainee_assessment_id", nullable = false, updatable = false)
    private TraineeAssessmentEntity traineeAssessment;

    @Column(name = "attempt_number", nullable = false)
    private int attemptNumber;

    @Column(name = "points_earned", nullable = false)
    private int pointsEarned = 0;

    @Column(name = "total_points", nullable = false)
    private int totalPoints = 0;

    @Column(name = "is_passed", nullable = false)
    private boolean passed = false;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAnswerEntity> answers = new ArrayList<>();

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
    public TraineeAssessmentEntity getTraineeAssessment() { return traineeAssessment; }
    public void setTraineeAssessment(TraineeAssessmentEntity traineeAssessment) { this.traineeAssessment = traineeAssessment; }
    public int getAttemptNumber() { return attemptNumber; }
    public void setAttemptNumber(int attemptNumber) { this.attemptNumber = attemptNumber; }
    public int getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(int pointsEarned) { this.pointsEarned = pointsEarned; }
    public int getTotalPoints() { return totalPoints; }
    public void setTotalPoints(int totalPoints) { this.totalPoints = totalPoints; }
    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public List<QuizAnswerEntity> getAnswers() { return answers; }
    public void setAnswers(List<QuizAnswerEntity> answers) { this.answers = answers != null ? answers : new ArrayList<>(); }
}
