package com.nac.slogbaa.infrastructure.notification;

import com.nac.slogbaa.infrastructure.email.EmailService;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

/**
 * Sends trainee welcome emails via EmailService when mail is configured.
 */
@Component
@ConditionalOnBean(EmailService.class)
public class EmailTraineeNotificationAdapter implements TraineeNotificationPort {

    private final EmailService emailService;

    public EmailTraineeNotificationAdapter(EmailService emailService) {
        this.emailService = emailService;
    }

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

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
