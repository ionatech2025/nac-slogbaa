package com.nac.slogbaa.progress.application.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Result DTO for a discussion reply.
 */
public record ReplyResult(
        UUID id,
        UUID threadId,
        String authorDisplayName,
        String authorType,
        String body,
        Instant createdAt
) {}
