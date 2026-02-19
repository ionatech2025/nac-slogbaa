package com.nac.slogbaa.iam.core.valueobject;

/**
 * Immutable value object holding staff information for notification purposes.
 * Pure domain - no framework dependencies.
 */
public record StaffInfo(String email, String fullName) {

    public StaffInfo {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email must not be blank");
        }
        if (fullName == null || fullName.isBlank()) {
            throw new IllegalArgumentException("fullName must not be blank");
        }
    }
}
