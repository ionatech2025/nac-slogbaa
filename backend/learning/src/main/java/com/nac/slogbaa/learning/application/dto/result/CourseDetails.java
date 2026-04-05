package com.nac.slogbaa.learning.application.dto.result;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Full course details with ordered modules and content blocks.
 */
public final class CourseDetails {
    private final UUID id;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final boolean published;
    private final Integer totalEstimatedMinutes;
    private final String categoryName;
    private final String categorySlug;
    private final UUID categoryId;
    private final List<ModuleSummary> modules;
    private final double averageRating;
    private final long reviewCount;

    public CourseDetails(UUID id, String title, String description, String imageUrl, boolean published,
                         Integer totalEstimatedMinutes, String categoryName, String categorySlug, UUID categoryId, List<ModuleSummary> modules) {
        this(id, title, description, imageUrl, published, totalEstimatedMinutes, categoryName, categorySlug, categoryId, modules, 0.0, 0);
    }

    public CourseDetails(UUID id, String title, String description, String imageUrl, boolean published,
                         Integer totalEstimatedMinutes, String categoryName, String categorySlug, UUID categoryId,
                         List<ModuleSummary> modules, double averageRating, long reviewCount) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.published = published;
        this.totalEstimatedMinutes = totalEstimatedMinutes;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
        this.categoryId = categoryId;
        this.modules = modules != null ? List.copyOf(modules) : List.of();
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public boolean isPublished() { return published; }
    public Integer getTotalEstimatedMinutes() { return totalEstimatedMinutes; }
    public String getCategoryName() { return categoryName; }
    public String getCategorySlug() { return categorySlug; }
    public UUID getCategoryId() { return categoryId; }
    public List<ModuleSummary> getModules() { return modules; }
    public double getAverageRating() { return averageRating; }
    public long getReviewCount() { return reviewCount; }
}
