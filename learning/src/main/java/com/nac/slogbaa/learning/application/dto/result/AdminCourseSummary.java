package com.nac.slogbaa.learning.application.dto.result;

import java.util.Objects;
import java.util.UUID;

/**
 * Course summary for admin list (includes published status).
 */
public final class AdminCourseSummary {
    private final UUID id;
    private final String title;
    private final String description;
    private final boolean published;
    private final int moduleCount;

    public AdminCourseSummary(UUID id, String title, String description, boolean published, int moduleCount) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.published = published;
        this.moduleCount = moduleCount >= 0 ? moduleCount : 0;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public boolean isPublished() { return published; }
    public int getModuleCount() { return moduleCount; }
}
