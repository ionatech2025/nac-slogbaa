package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when a trainee attempts to log in without having verified their email address.
 */
public class EmailNotVerifiedException extends RuntimeException {

    public EmailNotVerifiedException() {
        super("Please verify your email address before signing in. Check your inbox for a verification link.");
    }

    public EmailNotVerifiedException(String message) {
        super(message);
    }
}
