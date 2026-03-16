package com.nac.slogbaa.iam.core.valueobject;

import java.util.Objects;
import java.util.UUID;

/**
 * Identity of the currently authenticated user. Pure domain type; no framework or JWT dependency.
 */
public final class AuthenticatedIdentity {
    private final UUID userId;
    private final String email;
    private final AuthenticatedRole role;
    private final boolean isStaff;

    public AuthenticatedIdentity(UUID userId, String email, AuthenticatedRole role) {
        this.userId = Objects.requireNonNull(userId);
        this.email = Objects.requireNonNull(email);
        this.role = Objects.requireNonNull(role);
        this.isStaff = role == AuthenticatedRole.SUPER_ADMIN || role == AuthenticatedRole.ADMIN;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public AuthenticatedRole getRole() {
        return role;
    }

    public boolean isStaff() {
        return isStaff;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuthenticatedIdentity that = (AuthenticatedIdentity) o;
        return userId.equals(that.userId) && email.equals(that.email) && role == that.role;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, email, role);
    }
}
