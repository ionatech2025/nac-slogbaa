package com.nac.slogbaa.learning.core.aggregate;

import com.nac.slogbaa.learning.core.valueobject.CourseId;

import java.util.Objects;
import java.util.UUID;

/**
 * Course aggregate (read model for list view). Minimal domain for published courses listing.
 */
public final class Course {
    private final CourseId id;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final boolean published;
    private final int moduleCount;
    private final Integer totalEstimatedMinutes;
    private final String categoryName;
    private final String categorySlug;
    private final UUID prerequisiteCourseId;
    private final String prerequisiteCourseName;

    public Course(CourseId id, String title, String description, String imageUrl, boolean published, int moduleCount, Integer totalEstimatedMinutes, String categoryName, String categorySlug) {
        this(id, title, description, imageUrl, published, moduleCount, totalEstimatedMinutes, categoryName, categorySlug, null, null);
    }

    public Course(CourseId id, String title, String description, String imageUrl, boolean published, int moduleCount, Integer totalEstimatedMinutes, String categoryName, String categorySlug, UUID prerequisiteCourseId, String prerequisiteCourseName) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.published = published;
        this.moduleCount = moduleCount >= 0 ? moduleCount : 0;
        this.totalEstimatedMinutes = totalEstimatedMinutes;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
        this.prerequisiteCourseId = prerequisiteCourseId;
        this.prerequisiteCourseName = prerequisiteCourseName;
    }

    public CourseId getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public boolean isPublished() { return published; }
    public int getModuleCount() { return moduleCount; }
    public Integer getTotalEstimatedMinutes() { return totalEstimatedMinutes; }
    public String getCategoryName() { return categoryName; }
    public String getCategorySlug() { return categorySlug; }
    public UUID getPrerequisiteCourseId() { return prerequisiteCourseId; }
    public String getPrerequisiteCourseName() { return prerequisiteCourseName; }
}
