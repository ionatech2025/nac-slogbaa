package com.nac.slogbaa.app.cms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "homepage_banner")
public class HomepageBanner {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank(message = "Title is required")
    private String title;
    private String eyebrow;
    private String highlight;
    private String subtitle;
    @Column(name = "image_url") private String imageUrl;
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
    public String getEyebrow() { return eyebrow; }
    public void setEyebrow(String e) { this.eyebrow = e; }
    public String getHighlight() { return highlight; }
    public void setHighlight(String h) { this.highlight = h; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String s) { this.subtitle = s; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String u) { this.imageUrl = u; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int o) { this.sortOrder = o; }
    public boolean isActive() { return active; }
    public void setActive(boolean a) { this.active = a; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
