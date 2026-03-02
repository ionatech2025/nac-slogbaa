package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.ports.StaffNotificationPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

/**
 * Sends staff welcome emails via EmailService when mail is configured.
 * Uses app.password-reset.base-url (frontend app URL) to build an absolute login link.
 */
@Component
@ConditionalOnBean(EmailService.class)
public class EmailStaffNotificationAdapter implements StaffNotificationPort {

    private final EmailService emailService;
    private final String frontendBaseUrl;

    public EmailStaffNotificationAdapter(EmailService emailService,
                                         @Value("${app.password-reset.base-url:http://localhost:5173}") String frontendBaseUrl) {
        this.emailService = emailService;
        this.frontendBaseUrl = (frontendBaseUrl != null && !frontendBaseUrl.isBlank())
                ? frontendBaseUrl.replaceAll("/$", "") : "http://localhost:5173";
    }

    @Override
    public void sendStaffWelcomeEmail(String toEmail, String fullName, String initialPassword) {
        String loginUrl = frontendBaseUrl + "/auth/login";
        String htmlContent = """
            <h2>Welcome to SLOGBAA</h2>
            <p>Hello <strong>%s</strong>,</p>
            <p>Your staff account has been created. Here are your login details:</p>
            <ul>
                <li><strong>Email:</strong> %s</li>
                <li><strong>Initial password:</strong> %s</li>
            </ul>
            <p style="margin-top: 24px;">
                <a href="%s" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    Log in and change your password
                </a>
            </p>
            <p style="margin-top: 24px; color: #6b7280;">Please log in and change your password after your first login.</p>
            <p>— The SLOGBAA Team</p>
            """.formatted(
                escapeHtml(fullName),
                escapeHtml(toEmail),
                escapeHtml(initialPassword),
                escapeHtml(loginUrl)
        );
        emailService.sendHtmlEmail(toEmail, "Your SLOGBAA staff account", htmlContent);
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
