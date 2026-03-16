package com.nac.slogbaa.iam.application.dto.result;

import java.util.Objects;

/**
 * Result of successful authentication. No framework dependency.
 */
public final class AuthenticationResult {
    private final String token;
    private final String userId;
    private final String email;
    private final String role;
    private final String fullName;

    public AuthenticationResult(String token, String userId, String email, String role, String fullName) {
        this.token = Objects.requireNonNull(token);
        this.userId = Objects.requireNonNull(userId);
        this.email = Objects.requireNonNull(email);
        this.role = Objects.requireNonNull(role);
        this.fullName = fullName; // optional
    }

    public String getToken() {
        return token;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }
}
