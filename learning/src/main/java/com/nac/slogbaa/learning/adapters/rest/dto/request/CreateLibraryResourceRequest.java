package com.nac.slogbaa.learning.adapters.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for creating a library resource (POST /api/admin/library/resources).
 */
public record CreateLibraryResourceRequest(
        @NotBlank @Size(max = 500) String title,
        @Size(max = 5000) String description,
        String resourceType,
        @NotBlank @Size(max = 2048) String fileUrl,
        @Size(max = 50) String fileType
) {
    public String resourceType() {
        return resourceType != null && !resourceType.isBlank() ? resourceType : "DOCUMENT";
    }
}
