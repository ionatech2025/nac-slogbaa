package com.nac.slogbaa.app.cms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "homepage_video")
public class HomepageVideo {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "YouTube URL is required")
    @Column(name = "youtube_url") private String youtubeUrl;
    @Column(name = "sort_order") private int sortOrder;
    private boolean active = true;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "created_at") private Instant createdAt;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "updated_at") private Instant updatedAt;

    @PrePersist void onCreate() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    public String getYoutubeUrl() { return youtubeUrl; }
    public void setYoutubeUrl(String u) { this.youtubeUrl = u; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int o) { this.sortOrder = o; }
    public boolean isActive() { return active; }
    public void setActive(boolean a) { this.active = a; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
