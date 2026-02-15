package com.nac.slogbaa.iam.application.dto.result;

import java.util.Objects;

/**
 * Summary of a staff user for dashboard listing. No framework dependency.
 */
public final class StaffSummaryDto {
    private final String id;
    private final String fullName;
    private final String email;
    private final String role;

    public StaffSummaryDto(String id, String fullName, String email, String role) {
        this.id = Objects.requireNonNull(id);
        this.fullName = Objects.requireNonNull(fullName);
        this.email = Objects.requireNonNull(email);
        this.role = Objects.requireNonNull(role);
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
