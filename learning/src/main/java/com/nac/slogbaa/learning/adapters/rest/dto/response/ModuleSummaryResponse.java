package com.nac.slogbaa.learning.adapters.rest.dto.response;

import java.util.List;

/**
 * REST response for module with content blocks.
 */
public record ModuleSummaryResponse(
        String id,
        String title,
        String description,
        String imageUrl,
        int moduleOrder,
        boolean hasQuiz,
        List<ContentBlockSummaryResponse> contentBlocks
) {}
