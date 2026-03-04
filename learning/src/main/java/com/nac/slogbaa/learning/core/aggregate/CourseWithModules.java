package com.nac.slogbaa.learning.core.aggregate;

import com.nac.slogbaa.learning.core.entity.Module;
import com.nac.slogbaa.learning.core.valueobject.CourseId;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Course aggregate with full module and content block structure. Used when loading course details.
 * Modules and content blocks are ordered consistently (by module_order and block_order).
 */
public final class CourseWithModules {
    private final CourseId id;
    private final String title;
    private final String description;
    private final String imageUrl;
    private final boolean published;
    private final List<Module> modules;

    public CourseWithModules(CourseId id, String title, String description, String imageUrl, boolean published,
                             List<Module> modules) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.published = published;
        this.modules = modules != null ? List.copyOf(modules) : List.of();
    }

    public CourseId getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public boolean isPublished() { return published; }
    public List<Module> getModules() { return Collections.unmodifiableList(modules); }
}
