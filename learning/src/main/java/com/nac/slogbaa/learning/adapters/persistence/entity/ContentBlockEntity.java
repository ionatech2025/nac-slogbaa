package com.nac.slogbaa.learning.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "content_block", indexes = {
        @Index(name = "idx_content_block_module", columnList = "module_id")
})
public class ContentBlockEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false, updatable = false)
    private ModuleEntity module;

    @Enumerated(EnumType.STRING)
    @Column(name = "block_type", nullable = false, length = 30)
    private BlockTypeEnum blockType;

    @Column(name = "block_order", nullable = false)
    private int blockOrder;

    @Column(name = "rich_text", columnDefinition = "TEXT")
    @Convert(converter = EditorJsConverter.class)
    private EditorJsData richText;

    @Column(name = "image_url", length = 2048)
    private String imageUrl;

    @Column(name = "image_alt_text", length = 255)
    private String imageAltText;

    @Column(name = "image_caption", length = 500)
    private String imageCaption;

    @Column(name = "video_url", length = 2048)
    private String videoUrl;

    @Column(name = "video_id", length = 50)
    private String videoId;

    @Column(name = "activity_instructions", columnDefinition = "TEXT")
    private String activityInstructions;

    @Column(name = "activity_resources", columnDefinition = "TEXT")
    private String activityResources;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum BlockTypeEnum {
        TEXT,
        IMAGE,
        VIDEO,
        ACTIVITY
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ModuleEntity getModule() { return module; }
    public void setModule(ModuleEntity module) { this.module = module; }
    public BlockTypeEnum getBlockType() { return blockType; }
    public void setBlockType(BlockTypeEnum blockType) { this.blockType = blockType; }
    public int getBlockOrder() { return blockOrder; }
    public void setBlockOrder(int blockOrder) { this.blockOrder = blockOrder; }
    public EditorJsData getRichText() { return richText; }
    public void setRichText(EditorJsData richText) { this.richText = richText; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getImageAltText() { return imageAltText; }
    public void setImageAltText(String imageAltText) { this.imageAltText = imageAltText; }
    public String getImageCaption() { return imageCaption; }
    public void setImageCaption(String imageCaption) { this.imageCaption = imageCaption; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }
    public String getActivityInstructions() { return activityInstructions; }
    public void setActivityInstructions(String activityInstructions) { this.activityInstructions = activityInstructions; }
    public String getActivityResources() { return activityResources; }
    public void setActivityResources(String activityResources) { this.activityResources = activityResources; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
