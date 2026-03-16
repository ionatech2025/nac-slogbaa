package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when attempting to delete the last Super Admin.
 */
public class CannotDeleteLastSuperAdminException extends RuntimeException {

    public CannotDeleteLastSuperAdminException() {
        super("Cannot delete the last Super Admin.");
    }
}
