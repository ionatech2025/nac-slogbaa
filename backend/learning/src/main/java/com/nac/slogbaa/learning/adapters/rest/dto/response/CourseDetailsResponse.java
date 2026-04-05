package com.nac.slogbaa.learning.adapters.rest.dto.response;

import java.util.List;
import java.util.UUID;

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
        UUID categoryId,
        double averageRating,
        long reviewCount,
        List<ModuleSummaryResponse> modules
) {}
