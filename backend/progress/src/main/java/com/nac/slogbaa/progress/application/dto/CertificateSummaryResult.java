package com.nac.slogbaa.progress.application.dto;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Result DTO for admin certificate listing.
 */
public record CertificateSummaryResult(
        UUID id,
        UUID traineeId,
        UUID courseId,
        String certificateNumber,
        LocalDate issuedDate,
        int finalScorePercent,
        boolean revoked,
        String traineeName,
        String courseTitle
) {}
