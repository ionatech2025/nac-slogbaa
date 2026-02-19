package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

/**
 * Fallback: logs trainee welcome instead of sending when mail is not configured.
 */
@Component
@ConditionalOnMissingBean(EmailService.class)
public class LoggingTraineeNotificationAdapter implements TraineeNotificationPort {

    private static final Logger log = LoggerFactory.getLogger(LoggingTraineeNotificationAdapter.class);

    @Override
    public void sendTraineeWelcomeEmail(String toEmail, String fullName) {
        log.info("Trainee welcome (configure SMTP to send by email): to={}, fullName={}", toEmail, fullName);
    }
}
