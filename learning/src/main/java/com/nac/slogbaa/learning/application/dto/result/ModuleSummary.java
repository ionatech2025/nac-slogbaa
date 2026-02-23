package com.nac.slogbaa.learning.application.dto.result;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Module summary with ordered content blocks.
 */
public final class ModuleSummary {
    private final UUID id;
    private final String title;
    private final String description;
    private final int moduleOrder;
    private final boolean hasQuiz;
    private final List<ContentBlockSummary> contentBlocks;

    public ModuleSummary(UUID id, String title, String description, int moduleOrder,
                         boolean hasQuiz, List<ContentBlockSummary> contentBlocks) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.moduleOrder = moduleOrder;
        this.hasQuiz = hasQuiz;
        this.contentBlocks = contentBlocks != null ? List.copyOf(contentBlocks) : List.of();
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getModuleOrder() { return moduleOrder; }
    public boolean isHasQuiz() { return hasQuiz; }
    public List<ContentBlockSummary> getContentBlocks() { return contentBlocks; }
}
