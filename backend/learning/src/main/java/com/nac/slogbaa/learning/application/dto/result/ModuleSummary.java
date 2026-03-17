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
    private final String imageUrl;
    private final int moduleOrder;
    private final boolean hasQuiz;
    private final Integer estimatedMinutes;
    private final List<ContentBlockSummary> contentBlocks;

    public ModuleSummary(UUID id, String title, String description, String imageUrl, int moduleOrder,
                         boolean hasQuiz, Integer estimatedMinutes, List<ContentBlockSummary> contentBlocks) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.imageUrl = imageUrl;
        this.moduleOrder = moduleOrder;
        this.hasQuiz = hasQuiz;
        this.estimatedMinutes = estimatedMinutes;
        this.contentBlocks = contentBlocks != null ? List.copyOf(contentBlocks) : List.of();
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public int getModuleOrder() { return moduleOrder; }
    public boolean isHasQuiz() { return hasQuiz; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public List<ContentBlockSummary> getContentBlocks() { return contentBlocks; }
}
