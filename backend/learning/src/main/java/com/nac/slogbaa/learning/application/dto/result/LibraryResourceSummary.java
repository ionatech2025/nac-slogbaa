package com.nac.slogbaa.learning.application.dto.result;

import java.util.Objects;
import java.util.UUID;

/**
 * Summary of a published library resource for list views.
 */
public final class LibraryResourceSummary {

    private final UUID id;
    private final String title;
    private final String description;
    private final String resourceType;
    private final String fileUrl;
    private final String fileType;
    private final UUID courseId;

    public LibraryResourceSummary(UUID id, String title, String description,
                                  String resourceType, String fileUrl, String fileType, UUID courseId) {
        this.id = Objects.requireNonNull(id);
        this.title = Objects.requireNonNull(title);
        this.description = description;
        this.resourceType = resourceType != null ? resourceType : "DOCUMENT";
        this.fileUrl = Objects.requireNonNull(fileUrl);
        this.fileType = fileType;
        this.courseId = courseId;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getResourceType() { return resourceType; }
    public String getFileUrl() { return fileUrl; }
    public String getFileType() { return fileType; }
    public UUID getCourseId() { return courseId; }
}
