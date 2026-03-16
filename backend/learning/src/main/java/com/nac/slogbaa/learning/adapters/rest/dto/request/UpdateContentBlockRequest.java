package com.nac.slogbaa.learning.adapters.rest.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * REST request for updating a content block.
 * blockOrder defaults to 0 when omitted.
 */
public record UpdateContentBlockRequest(
        @NotBlank(message = "Block type is required")
        @Pattern(regexp = "^(?i)(TEXT|IMAGE|VIDEO|ACTIVITY)$", message = "Block type must be TEXT, IMAGE, VIDEO, or ACTIVITY")
        String blockType,

        @Min(0)
        Integer blockOrder,

        String richText,
        String imageUrl,
        String imageAltText,
        String imageCaption,
        String videoUrl,
        String videoId,
        String activityInstructions,
        String activityResources
) {
    public UpdateContentBlockRequest {
        if (blockOrder == null) blockOrder = 0;
    }
}
