package com.nac.slogbaa.learning.core.aggregate;

import com.nac.slogbaa.learning.core.valueobject.CourseId;

import java.util.Objects;

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

    public Course(CourseId id, String title, String description, String imageUrl, boolean published, int moduleCount) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.published = published;
        this.moduleCount = moduleCount >= 0 ? moduleCount : 0;
    }

    public CourseId getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public boolean isPublished() { return published; }
    public int getModuleCount() { return moduleCount; }
}
