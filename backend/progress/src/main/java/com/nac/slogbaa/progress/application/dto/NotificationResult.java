package com.nac.slogbaa.progress.application.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Result DTO for an in-app notification.
 */
public record NotificationResult(
        UUID id,
        String type,
        String title,
        String message,
        String link,
        boolean read,
        Instant createdAt
) {}
