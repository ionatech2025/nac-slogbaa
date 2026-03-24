package com.nac.slogbaa.app.cms.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;
import java.util.UUID;

public final class LiveSessionDtos {

    private LiveSessionDtos() {}

    /**
     * Create/update payload. {@code speakers} may be null when omitted on PUT to leave existing JSON unchanged.
     */
    public record LiveSessionUpsertRequest(
            @NotBlank String title,
            String description,
            String sessionDetails,
            String bannerImageUrl,
            @NotBlank String provider,
            @NotBlank String meetingUrl,
            String meetingId,
            String meetingPassword,
            @NotNull Instant scheduledAt,
            @Positive int durationMinutes,
            boolean active,
            JsonNode speakers
    ) {}

    public record LiveSessionCredentialsResponse(String meetingUrl, String meetingId, String meetingPassword) {}

    public record LiveSessionTraineeResponse(
            UUID id,
            String title,
            String description,
            String sessionDetails,
            String bannerImageUrl,
            JsonNode speakers,
            String provider,
            Instant scheduledAt,
            int durationMinutes,
            String phase,
            boolean registered,
            LiveSessionCredentialsResponse credentials
    ) {}

    public record LiveSessionAdminResponse(
            UUID id,
            String title,
            String description,
            String sessionDetails,
            String bannerImageUrl,
            JsonNode speakers,
            String provider,
            String meetingUrl,
            String meetingId,
            String meetingPassword,
            Instant scheduledAt,
            int durationMinutes,
            boolean active,
            long registrationCount,
            UUID createdBy,
            Instant createdAt,
            Instant updatedAt
    ) {}
}
