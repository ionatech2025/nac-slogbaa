package com.nac.slogbaa.learning.application.dto.result;

import java.util.Objects;
import java.util.UUID;

/**
 * Course summary for list views. No framework dependency.
 */
public final class CourseSummary {
    private final UUID id;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final int moduleCount;
    private final Integer totalEstimatedMinutes;
    private final String categoryName;
    private final String categorySlug;

    public CourseSummary(UUID id, String title, String description, String imageUrl, int moduleCount, Integer totalEstimatedMinutes, String categoryName, String categorySlug) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.moduleCount = moduleCount >= 0 ? moduleCount : 0;
        this.totalEstimatedMinutes = totalEstimatedMinutes;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public int getModuleCount() { return moduleCount; }
    public Integer getTotalEstimatedMinutes() { return totalEstimatedMinutes; }
    public String getCategoryName() { return categoryName; }
    public String getCategorySlug() { return categorySlug; }
}
