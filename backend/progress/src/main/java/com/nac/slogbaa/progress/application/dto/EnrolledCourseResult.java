package com.nac.slogbaa.progress.application.dto;

import java.util.UUID;

/**
 * Result of get enrolled courses: course summary plus trainee progress.
 */
public record EnrolledCourseResult(
        UUID id,
        String title,
        String description,
        String imageUrl,
        int moduleCount,
        int completionPercentage
) {}
