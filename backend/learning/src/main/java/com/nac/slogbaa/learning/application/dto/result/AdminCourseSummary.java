package com.nac.slogbaa.learning.application.dto.result;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * Course summary for admin list (includes published status and created date).
 */
public final class AdminCourseSummary {
    private final UUID id;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final boolean published;
    private final int moduleCount;
    private final Instant createdAt;
    private final String categoryName;
    private final String categorySlug;

    public AdminCourseSummary(UUID id, String title, String description, String imageUrl, boolean published, int moduleCount, Instant createdAt, String categoryName, String categorySlug) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.published = published;
        this.moduleCount = moduleCount >= 0 ? moduleCount : 0;
        this.createdAt = createdAt;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public boolean isPublished() { return published; }
    public int getModuleCount() { return moduleCount; }
    public Instant getCreatedAt() { return createdAt; }
    public String getCategoryName() { return categoryName; }
    public String getCategorySlug() { return categorySlug; }
}
