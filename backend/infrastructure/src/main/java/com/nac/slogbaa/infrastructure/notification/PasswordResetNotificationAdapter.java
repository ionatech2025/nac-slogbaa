package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.ports.PasswordResetNotificationPort;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Sends password reset emails via EmailService when mail is configured.
 */
@Component
@ConditionalOnBean(EmailService.class)
public class PasswordResetNotificationAdapter implements PasswordResetNotificationPort {

    private final EmailService emailService;

    public PasswordResetNotificationAdapter(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    @Override
    public void sendResetLink(String email, String token, String resetUrl) {
        String htmlContent = """
            <h2>Reset Your Password</h2>
            <p>You have requested to reset your password for your SLOGBAA account.</p>
            <p>Click the button below to set a new password. This link will expire in 15 minutes.</p>
            <p style="margin-top: 24px;">
                <a href="%s" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    Reset Password
                </a>
            </p>
            <p style="margin-top: 24px; font-size: 0.875rem; color: #6b7280;">
                If you did not request this, you can safely ignore this email.
            </p>
            <p style="margin-top: 24px;">— The SLOGBAA Team</p>
            """.formatted(escapeHtml(resetUrl));
        emailService.sendHtmlEmail(email, "Reset your SLOGBAA password", htmlContent);
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
