package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.infrastructure.email.EmailSendException;
import com.nac.slogbaa.shared.ports.EmailVerificationNotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Sends email verification emails via EmailService when mail is configured.
 * On send failure (SMTP/Resend misconfigured), logs the verification URL so it can be used manually.
 */
@Component
@ConditionalOnBean(EmailService.class)
public class EmailVerificationNotificationAdapter implements EmailVerificationNotificationPort {

    private static final Logger log = LoggerFactory.getLogger(EmailVerificationNotificationAdapter.class);

    private final EmailService emailService;

    public EmailVerificationNotificationAdapter(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    @Override
    public void sendVerificationLink(String email, String fullName, String verificationUrl) {
        String htmlContent = """
            <h2>Verify your email address</h2>
            <p>Hello <strong>%s</strong>,</p>
            <p>Thank you for registering on SLOGBAA. Please verify your email address by clicking the button below.</p>
            <p>This link will expire in 24 hours.</p>
            <p style="margin-top: 24px;">
                <a href="%s" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    Verify Email
                </a>
            </p>
            <p style="margin-top: 24px; font-size: 0.875rem; color: #6b7280;">
                If you did not create this account, you can safely ignore this email.
            </p>
            <p style="margin-top: 24px;">— The SLOGBAA Team</p>
            """.formatted(escapeHtml(fullName), escapeHtml(verificationUrl));
        try {
            emailService.sendHtmlEmail(email, "Verify your SLOGBAA email address", htmlContent);
        } catch (Exception e) {
            log.warn("Verification email could not be sent to {} (mail not configured or send failed): {}. " +
                    "Verification link for manual use: {}", sanitizeForLog(email), e.getMessage(), verificationUrl);
        }
    }

    private static String sanitizeForLog(String value) {
        if (value == null) return null;
        return value.replaceAll("[\\r\\n]", " ");
    }

    private static String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
