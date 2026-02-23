package com.nac.slogbaa.iam.application.port.in;

/**
 * Use case for password reset flow.
 */
public interface PasswordResetUseCase {

    /**
     * Initiate password reset for the given email. If user exists, generates token,
     * saves it, and sends reset link by email.
     */
    void initiateReset(String email);

    /**
     * Validate that the token exists, matches a user, and has not expired.
     *
     * @return true if valid, false otherwise
     */
    boolean validateResetToken(String token);

    /**
     * Complete the reset: if token is valid, hash new password, update user, and delete token.
     */
    void completeReset(String token, String newPassword);
}
