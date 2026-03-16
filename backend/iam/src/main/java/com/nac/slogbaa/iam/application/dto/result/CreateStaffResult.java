package com.nac.slogbaa.iam.application.dto.result;

import java.util.Objects;
import java.util.UUID;

/**
 * Result of creating a staff user.
 */
public final class CreateStaffResult {
    private final UUID staffId;
    private final String email;
    private final String fullName;
    private final String role;

    public CreateStaffResult(UUID staffId, String email, String fullName, String role) {
        this.staffId = Objects.requireNonNull(staffId);
        this.email = Objects.requireNonNull(email);
        this.fullName = Objects.requireNonNull(fullName);
        this.role = Objects.requireNonNull(role);
    }

    public UUID getStaffId() {
        return staffId;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRole() {
        return role;
    }
}
