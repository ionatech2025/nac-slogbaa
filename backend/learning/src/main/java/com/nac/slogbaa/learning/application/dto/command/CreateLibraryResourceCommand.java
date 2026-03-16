package com.nac.slogbaa.learning.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command to create a new library resource (draft).
 */
public final class CreateLibraryResourceCommand {

    private final String title;
    private final String description;
    private final String resourceType;
    private final String fileUrl;
    private final String fileType;
    private final UUID uploadedBy;

    public CreateLibraryResourceCommand(String title, String description, String resourceType,
                                        String fileUrl, String fileType, UUID uploadedBy) {
        this.title = Objects.requireNonNull(title, "title");
        this.description = description;
        this.resourceType = resourceType != null && !resourceType.isBlank() ? resourceType : "DOCUMENT";
        this.fileUrl = Objects.requireNonNull(fileUrl, "fileUrl");
        this.fileType = fileType;
        this.uploadedBy = Objects.requireNonNull(uploadedBy, "uploadedBy");
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getResourceType() { return resourceType; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
    public UUID getUploadedBy() { return uploadedBy; }
}
