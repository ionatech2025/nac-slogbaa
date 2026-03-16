package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when a staff user is not found by id.
 */
public class StaffNotFoundException extends RuntimeException {

    public StaffNotFoundException(String message) {
        super(message);
    }
}
