package com.nac.slogbaa.shared.ports;

/**
 * Port for notifying staff (e.g. welcome email with credentials on creation).
 * Implementations in infrastructure.
 */
public interface StaffNotificationPort {

    /**
     * Send a welcome email to newly created staff with their initial password.
     */
    void sendStaffWelcomeEmail(String toEmail, String fullName, String initialPassword);

    /**
     * Notify staff that their password was changed by an administrator. Includes credentials to log in.
     */
    void sendPasswordChangedByAdmin(String toEmail, String fullName, String newPassword);
}
