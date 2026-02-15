package com.nac.slogbaa.iam.adapters.notification;

import com.nac.slogbaa.iam.application.port.out.EmailNotificationPort;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

/**
 * Sends staff credentials by email when Spring Mail is configured (e.g. spring.mail.host).
 */
@Component
@ConditionalOnBean(JavaMailSender.class)
public class MailEmailNotificationAdapter implements EmailNotificationPort {

    private static final Logger log = LoggerFactory.getLogger(MailEmailNotificationAdapter.class);

    private final JavaMailSender mailSender;

    public MailEmailNotificationAdapter(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendStaffCredentials(String toEmail, String fullName, String initialPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Your SLOGBAA staff account");
            helper.setText(
                    "Hello " + fullName + ",\n\n"
                            + "Your staff account has been created.\n\n"
                            + "Email: " + toEmail + "\n"
                            + "Initial password: " + initialPassword + "\n\n"
                            + "Please log in and change your password after first login.\n\n"
                            + "— SLOGBAA",
                    false
            );
            mailSender.send(message);
            log.info("Sent staff credentials email to {}", toEmail);
        } catch (MessagingException e) {
            log.warn("Failed to send staff credentials email to {}: {}", toEmail, e.getMessage());
        }
    }
}
