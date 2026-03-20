package com.nac.slogbaa.progress.application.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Result DTO for a single bookmark.
 */
public record BookmarkResult(
        UUID id,
        UUID courseId,
        String courseTitle,
        UUID moduleId,
        String moduleTitle,
        UUID contentBlockId,
        String note,
        Instant createdAt
) {}
