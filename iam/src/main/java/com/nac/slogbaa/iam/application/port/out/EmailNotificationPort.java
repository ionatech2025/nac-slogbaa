package com.nac.slogbaa.iam.application.port.out;

/**
 * Port for sending email notifications. Implementations (SMTP or logging) in adapters.
 */
public interface EmailNotificationPort {

    /**
     * Send staff their login credentials (email + initial password) after account creation.
     */
    void sendStaffCredentials(String toEmail, String fullName, String initialPassword);
}
