package com.nac.slogbaa.app.cms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "in_person_training")
public class InPersonTraining {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String tag;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "event_date")
    private LocalDateTime eventDate;

    @Column(name = "sort_order")
    private int sortOrder;

    private boolean active = true;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "created_at")
    private Instant createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }

    // Getters and Setters
    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    public String getSummary() { return summary; }
    public void setSummary(String s) { this.summary = s; }
    public String getTag() { return tag; }
    public void setTag(String t) { this.tag = t; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String u) { this.imageUrl = u; }
    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime d) { this.eventDate = d; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int o) { this.sortOrder = o; }
    public boolean isActive() { return active; }
    public void setActive(boolean a) { this.active = a; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
