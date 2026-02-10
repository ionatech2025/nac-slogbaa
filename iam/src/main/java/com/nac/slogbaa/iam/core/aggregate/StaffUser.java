package com.nac.slogbaa.iam.core.aggregate;

import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;
import com.nac.slogbaa.iam.core.valueobject.StaffRole;

import java.util.Objects;

/**
 * Staff user aggregate (SuperAdmin, Admin). No framework dependency.
 */
public final class StaffUser {
    private final StaffUserId id;
    private final Email email;
    private final String passwordHash;
    private final String fullName;
    private final StaffRole staffRole;
    private final boolean isActive;

    public StaffUser(StaffUserId id, Email email, String passwordHash, String fullName,
                     StaffRole staffRole, boolean isActive) {
        this.id = Objects.requireNonNull(id);
        this.email = Objects.requireNonNull(email);
        this.passwordHash = Objects.requireNonNull(passwordHash);
        this.fullName = Objects.requireNonNull(fullName);
        this.staffRole = Objects.requireNonNull(staffRole);
        this.isActive = isActive;
    }

    public StaffUserId getId() {
        return id;
    }

    public Email getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public StaffRole getStaffRole() {
        return staffRole;
    }

    public boolean isActive() {
        return isActive;
    }
}
