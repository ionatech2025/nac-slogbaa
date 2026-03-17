package com.nac.slogbaa.iam.adapters.rest.dto.request;

import jakarta.validation.constraints.Size;

/**
 * Request body for DELETE /api/me/account (trainee self-service account deletion).
 */
public class DeleteAccountRequest {

    @Size(max = 500, message = "Reason must be at most 500 characters")
    private String reason;

    public DeleteAccountRequest() {}

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
