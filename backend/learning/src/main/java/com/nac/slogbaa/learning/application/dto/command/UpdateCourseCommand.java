package com.nac.slogbaa.learning.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command to update an existing course.
 */
public final class UpdateCourseCommand {
    private final UUID courseId;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final UUID categoryId;

    public UpdateCourseCommand(UUID courseId, String title, String description, String imageUrl, UUID categoryId) {
        this.courseId = Objects.requireNonNull(courseId);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
    }

    public UUID getCourseId() { return courseId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public UUID getCategoryId() { return categoryId; }
}
