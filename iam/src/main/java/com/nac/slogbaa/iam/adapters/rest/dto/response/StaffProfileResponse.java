package com.nac.slogbaa.iam.adapters.rest.dto.response;

/**
 * REST response for staff profile (GET /api/admin/staff/:id).
 */
public record StaffProfileResponse(
        String id,
        String fullName,
        String email,
        String role,
        boolean active
) {}
