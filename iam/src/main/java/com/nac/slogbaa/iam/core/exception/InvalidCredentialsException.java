package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when login fails (user not found or password does not match).
 * No framework dependency.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
