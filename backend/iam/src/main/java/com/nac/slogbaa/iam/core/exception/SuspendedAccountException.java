package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when login fails because the account is suspended or inactive.
 */
public class SuspendedAccountException extends RuntimeException {

    public SuspendedAccountException() {
        super("This account has been suspended.");
    }

    public SuspendedAccountException(String message) {
        super(message);
    }
}
