package com.nac.slogbaa.learning.application.dto.command;

import java.util.Objects;

/**
 * Command to update a library resource's metadata (title, description, link, etc.).
 */
public final class UpdateLibraryResourceCommand {

    private final String title;
    private final String description;
    private final String resourceType;
    private final String fileUrl;
    private final String fileType;

    public UpdateLibraryResourceCommand(String title, String description, String resourceType,
                                        String fileUrl, String fileType) {
        this.title = Objects.requireNonNull(title, "title");
        this.description = description;
        this.resourceType = resourceType != null && !resourceType.isBlank() ? resourceType : "DOCUMENT";
        this.fileUrl = Objects.requireNonNull(fileUrl, "fileUrl");
        this.fileType = fileType;
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getResourceType() { return resourceType; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
}
