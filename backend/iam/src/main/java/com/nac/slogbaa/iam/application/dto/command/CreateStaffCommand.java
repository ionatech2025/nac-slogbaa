package com.nac.slogbaa.iam.application.dto.command;

import java.util.Objects;

/**
 * Command for creating a new staff user (admin or super admin).
 */
public final class CreateStaffCommand {
    private final String fullName;
    private final String email;
    private final String role;
    private final String initialPassword;

    public CreateStaffCommand(String fullName, String email, String role, String initialPassword) {
        this.fullName = Objects.requireNonNull(fullName, "fullName must not be null");
        this.email = Objects.requireNonNull(email, "email must not be null");
        this.role = Objects.requireNonNull(role, "role must not be null");
        this.initialPassword = Objects.requireNonNull(initialPassword, "initialPassword must not be null");
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getInitialPassword() {
        return initialPassword;
    }
}
