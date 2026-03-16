package com.nac.slogbaa.learning.adapters.rest.dto.response;

import java.util.List;

/**
 * REST response for full course details (GET /api/courses/{id}).
 */
public record CourseDetailsResponse(
        String id,
        String title,
        String description,
        String imageUrl,
        boolean published,
        Integer totalEstimatedMinutes,
        String categoryName,
        String categorySlug,
        List<ModuleSummaryResponse> modules
) {}
