package com.nac.slogbaa.progress.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "certificate", indexes = {
        @Index(name = "idx_certificate_trainee", columnList = "trainee_id"),
        @Index(name = "idx_certificate_course", columnList = "course_id"),
        @Index(name = "idx_certificate_verification", columnList = "verification_code")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_certificate_number", columnNames = "certificate_number"),
        @UniqueConstraint(name = "uq_certificate_verification", columnNames = "verification_code"),
        @UniqueConstraint(name = "uq_certificate_trainee_course", columnNames = {"trainee_id", "course_id"})
})
public class CertificateEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "trainee_id", nullable = false, updatable = false)
    private UUID traineeId;

    @Column(name = "course_id", nullable = false, updatable = false)
    private UUID courseId;

    @Column(name = "certificate_number", nullable = false, length = 50)
    private String certificateNumber;

    @Column(name = "issued_date", nullable = false)
    private LocalDate issuedDate;

    @Column(name = "final_score_percent", nullable = false)
    private int finalScorePercent;

    @Column(name = "certificate_template_version", length = 50)
    private String certificateTemplateVersion;

    @Column(name = "layout_type", length = 50)
    private String layoutType;

    @Column(name = "verification_code", nullable = false, length = 255)
    private String verificationCode;

    @Column(name = "file_url", length = 2048)
    private String fileUrl;

    @Column(name = "email_sent_at")
    private Instant emailSentAt;

    @Column(name = "is_revoked", nullable = false)
    private boolean revoked = false;

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
    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public LocalDate getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; }
    public int getFinalScorePercent() { return finalScorePercent; }
    public void setFinalScorePercent(int finalScorePercent) { this.finalScorePercent = finalScorePercent; }
    public String getCertificateTemplateVersion() { return certificateTemplateVersion; }
    public void setCertificateTemplateVersion(String v) { this.certificateTemplateVersion = v; }
    public String getLayoutType() { return layoutType; }
    public void setLayoutType(String layoutType) { this.layoutType = layoutType; }
    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public Instant getEmailSentAt() { return emailSentAt; }
    public void setEmailSentAt(Instant emailSentAt) { this.emailSentAt = emailSentAt; }
    public boolean isRevoked() { return revoked; }
    public void setRevoked(boolean revoked) { this.revoked = revoked; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
