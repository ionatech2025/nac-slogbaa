package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.ports.StaffNotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

/**
 * Fallback: logs staff credentials instead of sending when mail is not configured.
 */
@Component
@ConditionalOnMissingBean(EmailService.class)
public class LoggingStaffNotificationAdapter implements StaffNotificationPort {

    private static final Logger log = LoggerFactory.getLogger(LoggingStaffNotificationAdapter.class);

    @Override
    public void sendStaffWelcomeEmail(String toEmail, String fullName, String initialPassword) {
        log.info("Staff credentials (configure SMTP to send by email): to={}, fullName={}, initialPassword={}",
                toEmail, fullName, initialPassword);
    }
}
