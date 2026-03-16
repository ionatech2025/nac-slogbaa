package com.nac.slogbaa.assessment.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quiz", uniqueConstraints = {
        @UniqueConstraint(name = "uq_quiz_module", columnNames = "module_id")
}, indexes = @Index(name = "idx_quiz_module", columnList = "module_id"))
public class QuizEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "module_id", nullable = false, updatable = false)
    private UUID moduleId;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "pass_threshold_percent", nullable = false)
    private int passThresholdPercent = 70;

    @Column(name = "max_attempts")
    private Integer maxAttempts;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionOrder")
    private List<QuestionEntity> questions = new ArrayList<>();

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
    public UUID getModuleId() { return moduleId; }
    public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public int getPassThresholdPercent() { return passThresholdPercent; }
    public void setPassThresholdPercent(int passThresholdPercent) { this.passThresholdPercent = passThresholdPercent; }
    public Integer getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(Integer maxAttempts) { this.maxAttempts = maxAttempts; }
    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public List<QuestionEntity> getQuestions() { return questions; }
    public void setQuestions(List<QuestionEntity> questions) { this.questions = questions != null ? questions : new ArrayList<>(); }
}
