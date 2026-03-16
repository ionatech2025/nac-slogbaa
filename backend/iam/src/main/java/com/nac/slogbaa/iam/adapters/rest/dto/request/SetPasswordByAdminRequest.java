package com.nac.slogbaa.iam.adapters.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for admin setting a user's password.
 */
public record SetPasswordByAdminRequest(
        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String newPassword
) {}
