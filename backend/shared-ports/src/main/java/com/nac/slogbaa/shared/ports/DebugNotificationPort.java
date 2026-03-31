package com.nac.slogbaa.shared.ports;

/**
 * Port for system-wide email debugging.
 * Allows the IAM module to trigger emails without knowing infrastructure details.
 */
public interface DebugNotificationPort {

    /**
     * Send a generic HTML email for debugging purposes.
     */
    void sendDebugEmail(String toEmail, String subject, String htmlContent);
}
