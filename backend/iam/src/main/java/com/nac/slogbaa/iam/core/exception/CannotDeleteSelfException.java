package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when a user attempts to delete their own staff account.
 */
public class CannotDeleteSelfException extends RuntimeException {

    public CannotDeleteSelfException() {
        super("You cannot delete your own account.");
    }
}
