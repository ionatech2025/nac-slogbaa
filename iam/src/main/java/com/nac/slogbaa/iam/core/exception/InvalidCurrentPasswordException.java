package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when the current password supplied for a password change does not match.
 * No framework dependency.
 */
public class InvalidCurrentPasswordException extends RuntimeException {

    public InvalidCurrentPasswordException() {
        super("Current password is incorrect");
    }

    public InvalidCurrentPasswordException(String message) {
        super(message);
    }
}
