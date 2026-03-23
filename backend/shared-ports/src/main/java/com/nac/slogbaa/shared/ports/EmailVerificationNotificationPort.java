package com.nac.slogbaa.shared.ports;

/**
 * Port for sending email verification notifications (verification link).
 * Registration uses one email that includes welcome text plus the verify button; resend uses the same template.
 */
public interface EmailVerificationNotificationPort {

    /**
     * Send welcome + verification link (HTML includes both onboarding copy and the verify button).
     *
     * @param email           the user's email address
     * @param fullName        the user's full name
     * @param verificationUrl the full URL to the verification page
     */
    void sendVerificationLink(String email, String fullName, String verificationUrl);
}
