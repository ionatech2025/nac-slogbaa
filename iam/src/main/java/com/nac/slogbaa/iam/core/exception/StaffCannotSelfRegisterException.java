package com.nac.slogbaa.iam.core.exception;

/**
 * Thrown when a staff email is used on the public trainee registration flow.
 * Staff accounts are created by administrators, not via self-registration.
 */
public class StaffCannotSelfRegisterException extends RuntimeException {

    public StaffCannotSelfRegisterException(String email) {
        super("This email is registered as a staff account. Staff cannot sign up through public registration. Please sign in with your existing account or contact your administrator.");
    }
}
