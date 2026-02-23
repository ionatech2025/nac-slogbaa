package com.nac.slogbaa.learning.adapters.rest.dto.response;

/**
 * REST response for content block (polymorphic by blockType).
 */
public record ContentBlockSummaryResponse(
        String id,
        String blockType,
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
