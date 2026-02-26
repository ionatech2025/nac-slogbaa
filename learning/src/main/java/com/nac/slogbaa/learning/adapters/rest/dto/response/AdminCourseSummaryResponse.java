package com.nac.slogbaa.learning.adapters.rest.dto.response;

/**
 * REST response for admin course summary (GET /api/admin/courses).
 */
public record AdminCourseSummaryResponse(
        String id,
        String title,
        String description,
        boolean published,
        int moduleCount
) {}
