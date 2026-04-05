package com.nac.slogbaa.learning.adapters.rest.dto.response;

import com.nac.slogbaa.learning.application.dto.result.AdminLibraryResourceSummary;

/**
 * REST response for admin library resource list.
 */
public record AdminLibraryResourceSummaryResponse(
        String id,
        String title,
        String description,
        String resourceType,
        String fileUrl,
        String fileType,
        boolean published,
        String courseId
) {
    public static AdminLibraryResourceSummaryResponse from(AdminLibraryResourceSummary s) {
        return new AdminLibraryResourceSummaryResponse(
                s.getId().toString(),
                s.getTitle(),
                s.getDescription(),
                s.getResourceType(),
                s.getFileUrl(),
                s.getFileType(),
                s.isPublished(),
                s.getCourseId() != null ? s.getCourseId().toString() : null
        );
    }
}
