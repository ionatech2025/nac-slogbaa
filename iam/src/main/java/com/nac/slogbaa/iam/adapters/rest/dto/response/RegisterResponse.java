package com.nac.slogbaa.iam.adapters.rest.dto.response;

import java.util.UUID;

/**
 * REST response for successful trainee registration.
 */
public class RegisterResponse {

    private final UUID traineeId;
    private final String email;

    public RegisterResponse(UUID traineeId, String email) {
        this.traineeId = traineeId;
        this.email = email;
    }

    public UUID getTraineeId() { return traineeId; }
    public String getEmail() { return email; }
}
