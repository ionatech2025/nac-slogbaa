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
    private final int moduleCount;

    public CourseSummary(UUID id, String title, String description, int moduleCount) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.moduleCount = moduleCount >= 0 ? moduleCount : 0;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getModuleCount() { return moduleCount; }
}
