package com.nac.slogbaa.iam.application.dto.result;

import java.util.Objects;
import java.util.UUID;

/**
 * Result of trainee registration. No framework dependency.
 */
public final class RegisterTraineeResult {
    private final UUID traineeId;
    private final String email;

    public RegisterTraineeResult(UUID traineeId, String email) {
        this.traineeId = Objects.requireNonNull(traineeId);
        this.email = Objects.requireNonNull(email);
    }

    public UUID getTraineeId() {
        return traineeId;
    }

    public String getEmail() {
        return email;
    }
}
