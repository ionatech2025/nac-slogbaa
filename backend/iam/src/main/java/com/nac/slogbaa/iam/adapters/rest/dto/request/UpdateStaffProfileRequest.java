package com.nac.slogbaa.iam.adapters.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for PATCH /api/admin/staff/:id (update staff profile by SuperAdmin).
 */
public record UpdateStaffProfileRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 200)
        String fullName,

        @NotBlank(message = "Email is required")
        @Size(max = 255)
        String email
) {}
