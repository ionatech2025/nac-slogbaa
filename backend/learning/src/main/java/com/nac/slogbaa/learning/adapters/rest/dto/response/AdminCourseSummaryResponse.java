package com.nac.slogbaa.learning.adapters.rest.dto.response;

import java.util.UUID;

/**
 * REST response for admin course summary (GET /api/admin/courses).
 */
public record AdminCourseSummaryResponse(
        String id,
        String title,
        String description,
        String imageUrl,
        boolean published,
        int moduleCount,
        String createdAt,
        String categoryName,
        String categorySlug,
        UUID categoryId
) {}
