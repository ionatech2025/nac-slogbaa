package com.nac.slogbaa.iam.application.dto.result;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Complete data export for a trainee (GDPR Article 20 - data portability).
 */
public record TraineeDataExportResult(
        Instant exportedAt,
        ProfileData profile,
        List<EnrollmentData> enrollments,
        List<BookmarkData> bookmarks,
        List<ReviewData> reviews
) {

    public record ProfileData(
            UUID id,
            String email,
            String firstName,
            String lastName,
            String gender,
            String districtName,
            String region,
            String category,
            String street,
            String city,
            String postalCode,
            String phoneCountryCode,
            String phoneNationalNumber
    ) {}

    public record EnrollmentData(
            UUID courseId,
            String courseTitle,
            String courseDescription,
            int completionPercentage
    ) {}

    public record BookmarkData(
            UUID id,
            UUID courseId,
            String courseTitle,
            UUID moduleId,
            String moduleTitle,
            UUID contentBlockId,
            String note,
            Instant createdAt
    ) {}

    public record ReviewData(
            UUID id,
            UUID courseId,
            int rating,
            String reviewText,
            Instant createdAt
    ) {}
}
