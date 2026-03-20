package com.nac.slogbaa.learning.adapters.rest.dto.response;

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
        String prerequisiteCourseId,
        String prerequisiteCourseName
) {}
