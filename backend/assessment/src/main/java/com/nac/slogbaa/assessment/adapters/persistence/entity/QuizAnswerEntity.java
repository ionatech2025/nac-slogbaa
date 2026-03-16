package com.nac.slogbaa.assessment.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "quiz_answer", indexes = @Index(name = "idx_quiz_answer_attempt", columnList = "quiz_attempt_id"))
public class QuizAnswerEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_attempt_id", nullable = false, updatable = false)
    private QuizAttemptEntity quizAttempt;

    @Column(name = "question_id", nullable = false, updatable = false)
    private UUID questionId;

    @Column(name = "selected_option_id", updatable = false)
    private UUID selectedOptionId;

    @Column(name = "text_answer", columnDefinition = "TEXT")
    private String textAnswer;

    @Column(name = "is_correct", nullable = false)
    private boolean correct = false;

    @Column(name = "points_awarded", nullable = false)
    private int pointsAwarded = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public QuizAttemptEntity getQuizAttempt() { return quizAttempt; }
    public void setQuizAttempt(QuizAttemptEntity quizAttempt) { this.quizAttempt = quizAttempt; }
    public UUID getQuestionId() { return questionId; }
    public void setQuestionId(UUID questionId) { this.questionId = questionId; }
    public UUID getSelectedOptionId() { return selectedOptionId; }
    public void setSelectedOptionId(UUID selectedOptionId) { this.selectedOptionId = selectedOptionId; }
    public String getTextAnswer() { return textAnswer; }
    public void setTextAnswer(String textAnswer) { this.textAnswer = textAnswer; }
    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }
    public int getPointsAwarded() { return pointsAwarded; }
    public void setPointsAwarded(int pointsAwarded) { this.pointsAwarded = pointsAwarded; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
