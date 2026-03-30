package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.util.FrontendAppBaseUrl;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Sends trainee welcome emails via EmailService when mail is configured.
 */
@Component
@ConditionalOnBean(EmailService.class)
public class EmailTraineeNotificationAdapter implements TraineeNotificationPort {

    private static final Logger log = LoggerFactory.getLogger(EmailTraineeNotificationAdapter.class);

    private final EmailService emailService;
    private final String frontendBaseUrl;

    public EmailTraineeNotificationAdapter(EmailService emailService,
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
    public void sendTraineeWelcomeEmail(String toEmail, String fullName) {
        String htmlContent = """
            <h2>Welcome to SLOGBAA</h2>
            <p>Hello <strong>%s</strong>,</p>
            <p>Thank you for registering on the <strong>SLOGBAA</strong> platform. We are excited to have you on board.</p>
            <p>— The SLOGBAA Team</p>
            """.formatted(escapeHtml(fullName));
        emailService.sendHtmlEmail(toEmail, "Welcome to SLOGBAA", htmlContent);
    }

    @Async
    @Override
    public void sendCertificateEmail(String toEmail, String traineeName, String courseTitle, byte[] pdfBytes) {
        String body = "Hello " + escapeHtml(traineeName) + ",\n\n"
                + "Congratulations! Your certificate for \"" + escapeHtml(courseTitle) + "\" is attached.\n\n"
                + "— The SLOGBAA Team";
        String filename = "certificate-" + escapeHtml(courseTitle).replaceAll("[^a-zA-Z0-9-]", "-") + ".pdf";
        emailService.sendEmailWithAttachment(toEmail, "Your SLOGBAA Certificate", body, pdfBytes, filename);
    }

    /**
     * Not async: superadmin password reset must complete the send in-request so failures surface
     * to the API (and the admin is not told "success" when mail never sent).
     */
    @Override
    public void sendPasswordChangedByAdmin(String toEmail, String fullName, String newPassword) {
        String loginUrl = frontendBaseUrl + "/auth/login";
        String htmlContent = """
            <h2>Your SLOGBAA password was updated</h2>
            <p>Hello <strong>%s</strong>,</p>
            <p>An administrator has updated your SLOGBAA account password. Use the credentials below to log in:</p>
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
