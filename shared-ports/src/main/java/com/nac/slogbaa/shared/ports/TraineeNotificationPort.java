package com.nac.slogbaa.shared.ports;

/**
 * Port for notifying trainees (e.g. welcome email on registration).
 * Implementations in infrastructure.
 */
public interface TraineeNotificationPort {

    /**
     * Send a welcome email to a newly registered trainee.
     */
    void sendTraineeWelcomeEmail(String toEmail, String fullName);
}
