package com.nac.slogbaa.iam.application.port.in;

/**
 * Use case for email verification flow.
 */
public interface VerifyEmailUseCase {

    /**
     * Send a verification email to the given address. Generates token, saves it,
     * and sends verification link.
     */
    void sendVerificationEmail(String email);

    /**
     * Verify the email using the provided token. If valid and not expired,
     * marks the trainee's email as verified.
     *
     * @return true if verification succeeded, false otherwise
     */
    boolean verify(String token);

    /**
     * Resend verification email. Deletes any existing tokens for the email,
     * then sends a new verification email.
     */
    void resendVerification(String email);
}
