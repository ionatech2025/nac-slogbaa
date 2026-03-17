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
    private final UUID prerequisiteCourseId;
    private final String prerequisiteCourseName;

    public CourseSummary(UUID id, String title, String description, String imageUrl, int moduleCount, Integer totalEstimatedMinutes, String categoryName, String categorySlug) {
        this(id, title, description, imageUrl, moduleCount, totalEstimatedMinutes, categoryName, categorySlug, null, null);
    }

    public CourseSummary(UUID id, String title, String description, String imageUrl, int moduleCount, Integer totalEstimatedMinutes, String categoryName, String categorySlug, UUID prerequisiteCourseId, String prerequisiteCourseName) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.moduleCount = moduleCount >= 0 ? moduleCount : 0;
        this.totalEstimatedMinutes = totalEstimatedMinutes;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
        this.prerequisiteCourseId = prerequisiteCourseId;
        this.prerequisiteCourseName = prerequisiteCourseName;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public int getModuleCount() { return moduleCount; }
    public Integer getTotalEstimatedMinutes() { return totalEstimatedMinutes; }
    public String getCategoryName() { return categoryName; }
    public String getCategorySlug() { return categorySlug; }
    public UUID getPrerequisiteCourseId() { return prerequisiteCourseId; }
    public String getPrerequisiteCourseName() { return prerequisiteCourseName; }
}
