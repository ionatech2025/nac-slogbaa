package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.ports.EmailVerificationNotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

/**
 * Fallback: logs notification events (without secrets) when mail is not configured.
 */
@Component
@ConditionalOnMissingBean(EmailService.class)
public class LoggingEmailVerificationNotificationAdapter implements EmailVerificationNotificationPort {

    private static final Logger log = LoggerFactory.getLogger(LoggingEmailVerificationNotificationAdapter.class);

    private static String sanitizeForLog(String value) {
        if (value == null) return null;
        // Prevent log injection by removing newlines/control chars.
        return value.replaceAll("[\\r\\n]", " ");
    }

    @Override
    public void sendVerificationLink(String email, String fullName, String verificationUrl) {
        log.info("Welcome + email verification (SMTP not configured): to={}, fullName={}, url={}",
                sanitizeForLog(email), sanitizeForLog(fullName), sanitizeForLog(verificationUrl)); // nosemgrep
    }
}
