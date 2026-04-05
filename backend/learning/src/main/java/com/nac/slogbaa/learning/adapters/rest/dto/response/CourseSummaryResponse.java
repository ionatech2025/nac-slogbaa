package com.nac.slogbaa.learning.adapters.rest.dto.response;

import java.util.UUID;

/**
 * REST response for course summary (GET /api/courses).
 */
public record CourseSummaryResponse(
        String id,
        String title,
        String description,
        String imageUrl,
        int moduleCount,
        Integer totalEstimatedMinutes,
        String categoryName,
        String categorySlug,
        UUID categoryId,
        String prerequisiteCourseId,
        String prerequisiteCourseName,
        double averageRating,
        long reviewCount
) {}
