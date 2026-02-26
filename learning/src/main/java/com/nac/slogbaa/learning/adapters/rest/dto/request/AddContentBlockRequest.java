package com.nac.slogbaa.learning.adapters.rest.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * REST request for adding a content block to a module.
 * Polymorphic by blockType: TEXT, IMAGE, VIDEO, ACTIVITY.
 */
public record AddContentBlockRequest(
        @NotBlank(message = "Block type is required")
        @Pattern(regexp = "^(?i)(TEXT|IMAGE|VIDEO|ACTIVITY)$", message = "Block type must be TEXT, IMAGE, VIDEO, or ACTIVITY")
        String blockType,

        @Min(0)
        int blockOrder,

        String richText,
        String imageUrl,
        String imageAltText,
        String imageCaption,
        String videoUrl,
        String videoId,
        String activityInstructions,
        String activityResources
) {}
