package com.nac.slogbaa.shared.ports;

/**
 * Port for sending password reset notifications (e.g. email with reset link).
 * Implementations in infrastructure. Pure domain interface.
 */
public interface PasswordResetNotificationPort {

    /**
     * Send a password reset link to the given email.
     *
     * @param email    the user's email address
     * @param token    the reset token
     * @param resetUrl the full URL to the reset page (e.g. https://app.example.com/reset-password?token=...)
     */
    void sendResetLink(String email, String token, String resetUrl);
}
