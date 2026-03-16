package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

/**
 * Fallback: logs notification events (without secrets) when mail is not configured.
 */
@Component
@ConditionalOnMissingBean(EmailService.class)
public class LoggingTraineeNotificationAdapter implements TraineeNotificationPort {

    private static final Logger log = LoggerFactory.getLogger(LoggingTraineeNotificationAdapter.class);

    @Override
    public void sendTraineeWelcomeEmail(String toEmail, String fullName) {
        log.info("Trainee welcome notification (SMTP not configured): to={}, fullName={}", toEmail, fullName);
    }

    @Override
    public void sendCertificateEmail(String toEmail, String traineeName, String courseTitle, byte[] pdfBytes) {
        log.info("Certificate email notification (SMTP not configured): to={}, course={}, pdfSize={}",
                toEmail, courseTitle, pdfBytes != null ? pdfBytes.length : 0);
    }

    @Override
    public void sendPasswordChangedByAdmin(String toEmail, String fullName, String newPassword) {
        log.info("Trainee password changed notification (SMTP not configured): to={}, fullName={}", toEmail, fullName);
        // SECURITY: Never log passwords — new password is not logged
    }
}
