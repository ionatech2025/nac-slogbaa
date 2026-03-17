package com.nac.slogbaa.learning.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command to update an existing module's title and description.
 */
public final class UpdateModuleCommand {
    private final UUID moduleId;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final Integer estimatedMinutes;

    public UpdateModuleCommand(UUID moduleId, String title, String description, String imageUrl, Integer estimatedMinutes) {
        this.moduleId = Objects.requireNonNull(moduleId);
        this.title = title != null ? title.trim() : "";
        this.description = description != null ? description : "";
        this.imageUrl = imageUrl;
        this.estimatedMinutes = estimatedMinutes;
    }

    public UUID getModuleId() { return moduleId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
}
