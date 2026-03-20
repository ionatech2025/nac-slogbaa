package com.nac.slogbaa.learning.adapters.rest.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

/**
 * REST request for updating a module's title and description.
 */
public record UpdateModuleRequest(
        @Size(max = 500)
        String title,

        String description,

        @Size(max = 2048)
        String imageUrl,

        @Min(0)
        Integer estimatedMinutes
) {}
