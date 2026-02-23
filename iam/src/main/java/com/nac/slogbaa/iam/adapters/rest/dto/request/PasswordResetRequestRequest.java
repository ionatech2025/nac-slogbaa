package com.nac.slogbaa.iam.adapters.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

/**
 * Request body for initiating password reset.
 */
public class PasswordResetRequestRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
