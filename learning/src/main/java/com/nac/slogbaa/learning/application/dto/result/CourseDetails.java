package com.nac.slogbaa.learning.application.dto.result;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Full course details with ordered modules and content blocks.
 */
public final class CourseDetails {
    private final UUID id;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final boolean published;
    private final List<ModuleSummary> modules;

    public CourseDetails(UUID id, String title, String description, String imageUrl, boolean published,
                         List<ModuleSummary> modules) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.published = published;
        this.modules = modules != null ? List.copyOf(modules) : List.of();
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public boolean isPublished() { return published; }
    public List<ModuleSummary> getModules() { return modules; }
}
