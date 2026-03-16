package com.nac.slogbaa.learning.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command to add a module to a course.
 */
public final class AddModuleCommand {
    private final UUID courseId;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final int moduleOrder;
    private final boolean hasQuiz;

    public AddModuleCommand(UUID courseId, String title, String description, String imageUrl, int moduleOrder, boolean hasQuiz) {
        this.courseId = Objects.requireNonNull(courseId);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.moduleOrder = moduleOrder >= 0 ? moduleOrder : 0;
        this.hasQuiz = hasQuiz;
    }

    public UUID getCourseId() { return courseId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public int getModuleOrder() { return moduleOrder; }
    public boolean isHasQuiz() { return hasQuiz; }
}
