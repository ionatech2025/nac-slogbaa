package com.nac.slogbaa.learning.core.entity;

import com.nac.slogbaa.learning.core.valueobject.BlockId;
import com.nac.slogbaa.learning.core.valueobject.BlockType;

import java.util.Objects;
import java.util.Optional;

/**
 * Content block within a module. Polymorphic by blockType — only relevant content fields are set.
 */
public final class ContentBlock {
    private final BlockId id;
    private final BlockType blockType;
    private final int blockOrder;

    private final String richText;
    private final String imageUrl;
    private final String imageAltText;
    private final String imageCaption;
    private final String videoUrl;
    private final String videoId;
    private final String activityInstructions;
    private final String activityResources;

    public ContentBlock(BlockId id, BlockType blockType, int blockOrder,
                        String richText,
                        String imageUrl, String imageAltText, String imageCaption,
                        String videoUrl, String videoId,
                        String activityInstructions, String activityResources) {
        this.id = Objects.requireNonNull(id);
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

    public BlockId getId() { return id; }
    public BlockType getBlockType() { return blockType; }
    public int getBlockOrder() { return blockOrder; }
    public Optional<String> getRichText() { return Optional.ofNullable(richText); }
    public Optional<String> getImageUrl() { return Optional.ofNullable(imageUrl); }
    public Optional<String> getImageAltText() { return Optional.ofNullable(imageAltText); }
    public Optional<String> getImageCaption() { return Optional.ofNullable(imageCaption); }
    public Optional<String> getVideoUrl() { return Optional.ofNullable(videoUrl); }
    public Optional<String> getVideoId() { return Optional.ofNullable(videoId); }
    public Optional<String> getActivityInstructions() { return Optional.ofNullable(activityInstructions); }
    public Optional<String> getActivityResources() { return Optional.ofNullable(activityResources); }
}
