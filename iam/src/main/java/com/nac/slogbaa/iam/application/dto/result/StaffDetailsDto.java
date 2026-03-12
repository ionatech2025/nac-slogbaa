package com.nac.slogbaa.iam.application.dto.result;

import java.util.Objects;

/**
 * Full staff profile for admin user management. No framework dependency.
 */
public final class StaffDetailsDto {
    private final String id;
    private final String fullName;
    private final String email;
    private final String role;
    private final boolean active;

    public StaffDetailsDto(String id, String fullName, String email, String role, boolean active) {
        this.id = Objects.requireNonNull(id);
        this.fullName = Objects.requireNonNull(fullName);
        this.email = Objects.requireNonNull(email);
        this.role = Objects.requireNonNull(role);
        this.active = active;
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }
}
