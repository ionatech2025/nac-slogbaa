package com.nac.slogbaa.iam.adapters.rest.dto.response;

/**
 * REST response for trainee profile (GET /api/trainee/me).
 */
public record TraineeProfileResponse(
        String id,
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
        String phoneNationalNumber,
        String profileImageUrl
) {}
