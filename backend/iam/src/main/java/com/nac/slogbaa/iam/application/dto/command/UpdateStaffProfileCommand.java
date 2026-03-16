package com.nac.slogbaa.iam.application.dto.command;

/**
 * Command for SuperAdmin updating a staff user's profile.
 */
public final class UpdateStaffProfileCommand {
    private final String fullName;
    private final String email;

    public UpdateStaffProfileCommand(String fullName, String email) {
        this.fullName = fullName == null ? null : fullName.strip();
        this.email = email == null ? null : email.strip();
    }

    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
}
