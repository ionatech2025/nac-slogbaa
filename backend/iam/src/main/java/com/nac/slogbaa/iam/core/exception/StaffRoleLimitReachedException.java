package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when creating a staff user would exceed the allowed limit for that role.
 * Limits: max 3 SUPER_ADMIN, max 5 ADMIN.
 */
public class StaffRoleLimitReachedException extends RuntimeException {

    public StaffRoleLimitReachedException(String message) {
        super(message);
    }
}
