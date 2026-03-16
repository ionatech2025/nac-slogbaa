package com.nac.slogbaa.learning.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command to create a new course. SuperAdmin only.
 */
public final class CreateCourseCommand {
    private final String title;
    private final String description;
    private final String imageUrl;
    private final UUID createdBy;

    public CreateCourseCommand(String title, String description, String imageUrl, UUID createdBy) {
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdBy = Objects.requireNonNull(createdBy);
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public UUID getCreatedBy() { return createdBy; }
}
