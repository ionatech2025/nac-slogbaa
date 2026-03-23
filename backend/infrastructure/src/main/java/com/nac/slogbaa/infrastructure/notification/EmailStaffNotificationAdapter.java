package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.util.FrontendAppBaseUrl;
import com.nac.slogbaa.shared.ports.StaffNotificationPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Async;
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
                                         @Value("${app.password-reset.base-url:http://localhost:5173}") String frontendBaseUrl,
                                         Environment env) {
        this.emailService = emailService;
        boolean prod = FrontendAppBaseUrl.isProductionProfile(env.getProperty("spring.profiles.active", ""));
        String base = (frontendBaseUrl != null && !frontendBaseUrl.isBlank())
                ? FrontendAppBaseUrl.normalize(frontendBaseUrl, prod).replaceAll("/$", "") : "http://localhost:5173";
        this.frontendBaseUrl = base;
    }

    @Async
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

    @Async
    @Override
    public void sendPasswordChangedByAdmin(String toEmail, String fullName, String newPassword) {
        String loginUrl = frontendBaseUrl + "/auth/login";
        String htmlContent = """
            <h2>Your SLOGBAA password was updated</h2>
            <p>Hello <strong>%s</strong>,</p>
            <p>An administrator has updated your SLOGBAA staff account password. Use the credentials below to log in:</p>
            <ul>
                <li><strong>Email:</strong> %s</li>
                <li><strong>New password:</strong> %s</li>
            </ul>
            <p style="margin-top: 24px;">
                <a href="%s" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    Log in to SLOGBAA
                </a>
            </p>
            <p style="margin-top: 24px; color: #6b7280;">If you did not request this change, please contact your administrator.</p>
            <p>— The SLOGBAA Team</p>
            """.formatted(
                escapeHtml(fullName),
                escapeHtml(toEmail),
                escapeHtml(newPassword),
                escapeHtml(loginUrl)
        );
        emailService.sendHtmlEmail(toEmail, "Your SLOGBAA password was updated", htmlContent);
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
