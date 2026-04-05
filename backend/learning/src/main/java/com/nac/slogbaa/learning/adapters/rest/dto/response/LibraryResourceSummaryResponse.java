package com.nac.slogbaa.learning.adapters.rest.dto.response;

import com.nac.slogbaa.learning.application.dto.result.LibraryResourceSummary;

/**
 * REST response for a library resource summary (GET /api/library/resources).
 */
public record LibraryResourceSummaryResponse(
        String id,
        String title,
        String description,
        String resourceType,
        String fileUrl,
        String fileType,
        String courseId
) {
    public static LibraryResourceSummaryResponse from(LibraryResourceSummary s) {
        return new LibraryResourceSummaryResponse(
                s.getId().toString(),
                s.getTitle(),
                s.getDescription(),
                s.getResourceType(),
                s.getFileUrl(),
                s.getFileType(),
                s.getCourseId() != null ? s.getCourseId().toString() : null
        );
    }
}
