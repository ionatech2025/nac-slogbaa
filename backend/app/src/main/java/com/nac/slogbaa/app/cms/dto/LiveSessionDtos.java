package com.nac.slogbaa.app.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class LiveSessionDtos {

    private LiveSessionDtos() {}

    public record LiveSessionSpeakerDto(
            UUID id,
            @NotBlank String name,
            String role,
            String bio,
            String photoUrl,
            int displayOrder
    ) {}

    /**
     * Create/update payload. {@code speakers} may be null when omitted on PUT to leave existing records unchanged.
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
            List<LiveSessionSpeakerDto> speakers
    ) {}

    public record LiveSessionCredentialsResponse(String meetingUrl, String meetingId, String meetingPassword) {}

    public record LiveSessionTraineeResponse(
            UUID id,
            String title,
            String description,
            String sessionDetails,
            String bannerImageUrl,
            List<LiveSessionSpeakerDto> speakers,
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
            List<LiveSessionSpeakerDto> speakers,
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
