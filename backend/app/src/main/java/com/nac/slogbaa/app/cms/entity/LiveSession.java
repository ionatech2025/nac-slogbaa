package com.nac.slogbaa.app.cms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "live_session")
public class LiveSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    /** Rich text / bullet list of what the session will cover */
    @Column(name = "session_details", columnDefinition = "TEXT")
    private String sessionDetails;

    @Column(name = "banner_image_url")
    private String bannerImageUrl;

    private String provider = "ZOOM";

    @NotBlank(message = "Meeting URL is required")
    @Column(name = "meeting_url")
    private String meetingUrl;

    @Column(name = "meeting_id")
    private String meetingId;

    @Column(name = "meeting_password")
    private String meetingPassword;

    @NotNull(message = "Scheduled time is required")
    @Column(name = "scheduled_at")
    private Instant scheduledAt;

    @Column(name = "duration_minutes")
    private int durationMinutes = 60;

    private boolean active = true;

    @OneToMany(mappedBy = "liveSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private java.util.List<LiveSessionSpeaker> speakers = new java.util.ArrayList<>();

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "created_by")
    private UUID createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "created_at")
    private Instant createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSessionDetails() {
        return sessionDetails;
    }

    public void setSessionDetails(String sessionDetails) {
        this.sessionDetails = sessionDetails;
    }

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(String bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getMeetingUrl() {
        return meetingUrl;
    }

    public void setMeetingUrl(String meetingUrl) {
        this.meetingUrl = meetingUrl;
    }

    public String getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }

    public String getMeetingPassword() {
        return meetingPassword;
    }

    public void setMeetingPassword(String meetingPassword) {
        this.meetingPassword = meetingPassword;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public java.util.List<LiveSessionSpeaker> getSpeakers() {
        return speakers;
    }

    public void setSpeakers(java.util.List<LiveSessionSpeaker> speakers) {
        this.speakers = speakers;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
