package com.nac.slogbaa.shared.ports;

/**
 * Port for sending email verification notifications (e.g. email with verification link).
 * Implementations in infrastructure. Pure domain interface.
 */
public interface EmailVerificationNotificationPort {

    /**
     * Send a verification link to the given email.
     *
     * @param email           the user's email address
     * @param fullName        the user's full name
     * @param verificationUrl the full URL to the verification page
     */
    void sendVerificationLink(String email, String fullName, String verificationUrl);
}
