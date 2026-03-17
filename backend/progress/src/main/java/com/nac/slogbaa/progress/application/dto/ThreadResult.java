package com.nac.slogbaa.progress.application.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Result DTO for a discussion thread.
 */
public record ThreadResult(
        UUID id,
        UUID courseId,
        UUID moduleId,
        String authorDisplayName,
        String authorType,
        String title,
        String body,
        boolean isResolved,
        int replyCount,
        Instant createdAt
) {}
