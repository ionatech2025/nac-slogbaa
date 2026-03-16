package com.nac.slogbaa.iam.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command for staff changing their own password. No framework dependency.
 */
public final class ChangeStaffPasswordCommand {
    private final UUID staffUserId;
    private final String currentPassword;
    private final String newPassword;

    public ChangeStaffPasswordCommand(UUID staffUserId, String currentPassword, String newPassword) {
        this.staffUserId = Objects.requireNonNull(staffUserId, "staffUserId must not be null");
        this.currentPassword = Objects.requireNonNull(currentPassword, "currentPassword must not be null");
        this.newPassword = Objects.requireNonNull(newPassword, "newPassword must not be null");
    }

    public UUID getStaffUserId() {
        return staffUserId;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
