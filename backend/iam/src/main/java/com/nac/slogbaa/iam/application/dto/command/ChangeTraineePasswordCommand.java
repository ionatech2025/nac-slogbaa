package com.nac.slogbaa.iam.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command for trainee changing their own password. No framework dependency.
 */
public final class ChangeTraineePasswordCommand {
    private final UUID traineeUserId;
    private final String currentPassword;
    private final String newPassword;

    public ChangeTraineePasswordCommand(UUID traineeUserId, String currentPassword, String newPassword) {
        this.traineeUserId = Objects.requireNonNull(traineeUserId, "traineeUserId must not be null");
        this.currentPassword = Objects.requireNonNull(currentPassword, "currentPassword must not be null");
        this.newPassword = Objects.requireNonNull(newPassword, "newPassword must not be null");
    }

    public UUID getTraineeUserId() {
        return traineeUserId;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
