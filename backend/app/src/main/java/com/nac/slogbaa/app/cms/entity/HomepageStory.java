package com.nac.slogbaa.app.cms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "homepage_story")
public class HomepageStory {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank(message = "Author name is required")
    @Column(name = "author_name") private String authorName;
    @Column(name = "author_role") private String authorRole;
    @Column(name = "title") private String title;
    @Column(name = "location") private String location;
    @Column(name = "courses_completed") private String coursesCompleted;
    @Column(name = "project_impact") private String projectImpact;
    @Column(name = "certification") private String certification;
    @NotBlank(message = "Story text is required")
    @Column(name = "story_text") private String storyText;
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
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String n) { this.authorName = n; }
    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String r) { this.authorRole = r; }
    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    public String getLocation() { return location; }
    public void setLocation(String l) { this.location = l; }
    public String getCoursesCompleted() { return coursesCompleted; }
    public void setCoursesCompleted(String c) { this.coursesCompleted = c; }
    public String getProjectImpact() { return projectImpact; }
    public void setProjectImpact(String p) { this.projectImpact = p; }
    public String getCertification() { return certification; }
    public void setCertification(String c) { this.certification = c; }
    public String getStoryText() { return storyText; }
    public void setStoryText(String t) { this.storyText = t; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String u) { this.imageUrl = u; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int o) { this.sortOrder = o; }
    public boolean isActive() { return active; }
    public void setActive(boolean a) { this.active = a; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
