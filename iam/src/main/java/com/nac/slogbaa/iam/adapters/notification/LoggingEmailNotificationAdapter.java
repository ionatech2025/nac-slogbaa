package com.nac.slogbaa.iam.adapters.notification;

import com.nac.slogbaa.iam.application.port.out.EmailNotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * Fallback email adapter: logs credentials instead of sending when SMTP is not configured.
 */
@Component
@ConditionalOnMissingBean(JavaMailSender.class)
public class LoggingEmailNotificationAdapter implements EmailNotificationPort {

    private static final Logger log = LoggerFactory.getLogger(LoggingEmailNotificationAdapter.class);

    @Override
    public void sendStaffCredentials(String toEmail, String fullName, String initialPassword) {
        log.info("Staff credentials (configure SMTP to send by email): to={}, fullName={}, initialPassword={}",
                toEmail, fullName, initialPassword);
    }
}
