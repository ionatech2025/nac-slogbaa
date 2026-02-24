package com.nac.slogbaa.learning.core.entity;

import com.nac.slogbaa.learning.core.valueobject.ModuleId;
import com.nac.slogbaa.learning.core.valueobject.ModuleOrder;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Module within a course. Contains ordered content blocks.
 */
public final class Module {
    private final ModuleId id;
    private final String title;
    private final String description;
    private final ModuleOrder moduleOrder;
    private final boolean hasQuiz;
    private final List<ContentBlock> contentBlocks;

    public Module(ModuleId id, String title, String description, ModuleOrder moduleOrder,
                  boolean hasQuiz, List<ContentBlock> contentBlocks) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.moduleOrder = Objects.requireNonNull(moduleOrder);
        this.hasQuiz = hasQuiz;
        this.contentBlocks = contentBlocks != null ? List.copyOf(contentBlocks) : List.of();
    }

    public ModuleId getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public ModuleOrder getModuleOrder() { return moduleOrder; }
    public boolean isHasQuiz() { return hasQuiz; }
    public List<ContentBlock> getContentBlocks() { return Collections.unmodifiableList(contentBlocks); }
}
