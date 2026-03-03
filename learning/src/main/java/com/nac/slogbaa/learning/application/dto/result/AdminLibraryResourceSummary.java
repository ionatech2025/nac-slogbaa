package com.nac.slogbaa.learning.application.dto.result;

import java.util.Objects;
import java.util.UUID;

/**
 * Library resource summary for admin list (includes published flag).
 */
public final class AdminLibraryResourceSummary {

    private final UUID id;
    private final String title;
    private final String description;
    private final String resourceType;
    private final String fileUrl;
    private final String fileType;
    private final boolean published;

    public AdminLibraryResourceSummary(UUID id, String title, String description,
                                       String resourceType, String fileUrl, String fileType, boolean published) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.resourceType = resourceType != null ? resourceType : "DOCUMENT";
        this.fileUrl = Objects.requireNonNull(fileUrl);
        this.fileType = fileType;
        this.published = published;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getResourceType() { return resourceType; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
    public boolean isPublished() { return published; }
}
