package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when a password reset token is invalid or expired.
 */
public class InvalidResetTokenException extends RuntimeException {

    public InvalidResetTokenException() {
        super("Password reset link is invalid or has expired.");
    }

    public InvalidResetTokenException(String message) {
        super(message);
    }
}
