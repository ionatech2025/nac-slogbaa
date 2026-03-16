package com.nac.slogbaa.learning.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command to update an existing content block.
 */
public final class UpdateContentBlockCommand {
    private final UUID blockId;
    private final UUID moduleId;
    private final String blockType;
    private final int blockOrder;

    private final String richText;
    private final String imageUrl;
    private final String imageAltText;
    private final String imageCaption;
    private final String videoUrl;
    private final String videoId;
    private final String activityInstructions;
    private final String activityResources;

    public UpdateContentBlockCommand(UUID blockId, UUID moduleId, String blockType, int blockOrder,
                                     String richText,
                                     String imageUrl, String imageAltText, String imageCaption,
                                     String videoUrl, String videoId,
                                     String activityInstructions, String activityResources) {
        this.blockId = Objects.requireNonNull(blockId);
        this.moduleId = Objects.requireNonNull(moduleId);
        this.blockType = Objects.requireNonNull(blockType);
        this.blockOrder = blockOrder >= 0 ? blockOrder : 0;
        this.richText = richText;
        this.imageUrl = imageUrl;
        this.imageAltText = imageAltText;
        this.imageCaption = imageCaption;
        this.videoUrl = videoUrl;
        this.videoId = videoId;
        this.activityInstructions = activityInstructions;
        this.activityResources = activityResources;
    }

    public UUID getBlockId() { return blockId; }
    public UUID getModuleId() { return moduleId; }
    public String getBlockType() { return blockType; }
    public int getBlockOrder() { return blockOrder; }
    public String getRichText() { return richText; }
    public String getImageUrl() { return imageUrl; }
    public String getImageAltText() { return imageAltText; }
    public String getImageCaption() { return imageCaption; }
    public String getVideoUrl() { return videoUrl; }
    public String getVideoId() { return videoId; }
    public String getActivityInstructions() { return activityInstructions; }
    public String getActivityResources() { return activityResources; }
}
