package com.nac.slogbaa.learning.application.dto.result;

import java.util.Objects;
import java.util.UUID;

/**
 * Content block summary. Polymorphic by blockType — only relevant fields are set per type:
 * TEXT: richText; IMAGE: imageUrl, imageAltText, imageCaption; VIDEO: videoUrl, videoId; ACTIVITY: activityInstructions, activityResources.
 */
public final class ContentBlockSummary {
    private final UUID id;
    private final String blockType;
    private final int blockOrder;

    // TEXT
    private final String richText;

    // IMAGE
    private final String imageUrl;
    private final String imageAltText;
    private final String imageCaption;

    // VIDEO
    private final String videoUrl;
    private final String videoId;

    // ACTIVITY
    private final String activityInstructions;
    private final String activityResources;

    public ContentBlockSummary(UUID id, String blockType, int blockOrder,
                              String richText,
                              String imageUrl, String imageAltText, String imageCaption,
                              String videoUrl, String videoId,
                              String activityInstructions, String activityResources) {
        this.id = Objects.requireNonNull(id);
        this.blockType = Objects.requireNonNull(blockType);
        this.blockOrder = blockOrder;
        this.richText = richText;
        this.imageUrl = imageUrl;
        this.imageAltText = imageAltText;
        this.imageCaption = imageCaption;
        this.videoUrl = videoUrl;
        this.videoId = videoId;
        this.activityInstructions = activityInstructions;
        this.activityResources = activityResources;
    }

    public UUID getId() { return id; }
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
