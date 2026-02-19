package com.nac.slogbaa.iam.application.port.out;

import com.nac.slogbaa.iam.core.valueobject.StaffInfo;

/**
 * Port for notifying when a staff user is created (e.g. welcome email with credentials).
 * Implementations in adapters; pure domain interface.
 */
public interface StaffCreationNotificationPort {

    /**
     * Send a welcome email to the newly created staff with their initial password.
     */
    void sendStaffWelcomeEmail(StaffInfo info, String initialPassword);
}
