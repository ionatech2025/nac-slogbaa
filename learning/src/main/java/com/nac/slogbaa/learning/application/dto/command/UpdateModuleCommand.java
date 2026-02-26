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

    public UpdateModuleCommand(UUID moduleId, String title, String description) {
        this.moduleId = Objects.requireNonNull(moduleId);
        this.title = title != null ? title.trim() : "";
        this.description = description != null ? description : "";
    }

    public UUID getModuleId() { return moduleId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
}
