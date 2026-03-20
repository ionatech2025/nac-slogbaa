package com.nac.slogbaa.iam.core.entity;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain entity representing an email verification token.
 * Pure domain - no framework dependencies.
 */
public final class EmailVerificationToken {

    private final String token;
    private final String userEmail;
    private final Instant expiryDate;

    public EmailVerificationToken(String token, String userEmail, Instant expiryDate) {
        this.token = Objects.requireNonNull(token, "token must not be null");
        this.userEmail = Objects.requireNonNull(userEmail, "userEmail must not be null");
        this.expiryDate = Objects.requireNonNull(expiryDate, "expiryDate must not be null");
    }

    public String getToken() {
        return token;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }

    public boolean isExpired() {
        return Instant.now().isAfter(expiryDate);
    }
}
