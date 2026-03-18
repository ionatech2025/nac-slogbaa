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
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private String provider = "ZOOM";
    @NotBlank(message = "Meeting URL is required")
    @Column(name = "meeting_url") private String meetingUrl;
    @NotNull(message = "Scheduled time is required")
    @Column(name = "scheduled_at") private Instant scheduledAt;
    @Column(name = "duration_minutes") private int durationMinutes = 60;
    private boolean active = true;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "created_by") private UUID createdBy;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "created_at") private Instant createdAt;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "updated_at") private Instant updatedAt;

    @PrePersist void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }
    public String getProvider() { return provider; }
    public void setProvider(String p) { this.provider = p; }
    public String getMeetingUrl() { return meetingUrl; }
    public void setMeetingUrl(String u) { this.meetingUrl = u; }
    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant s) { this.scheduledAt = s; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int d) { this.durationMinutes = d; }
    public boolean isActive() { return active; }
    public void setActive(boolean a) { this.active = a; }
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID c) { this.createdBy = c; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
