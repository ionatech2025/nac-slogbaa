package com.nac.slogbaa.infrastructure.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;

/**
 * SMTP-based email service (default). When {@code app.email.provider=resend},
 * {@link ResendEmailService} is activated as {@code @Primary} and takes precedence.
 */
@Service
@Slf4j
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "app.email.provider", havingValue = "smtp", matchIfMissing = true)
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    public EmailService(org.springframework.beans.factory.ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    /**
     * Send an HTML email.
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        requireMailSender();
        String sender = resolveSender();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Sent HTML email successfully to {} with subject '{}'", sanitizeForLog(to), sanitizeForLog(subject)); // nosemgrep
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {} with subject '{}': {}", sanitizeForLog(to), sanitizeForLog(subject), sanitizeForLog(e.getMessage())); // nosemgrep
            throw new EmailSendException("Failed to send email", e);
        }
    }

    /**
     * Send a simple plain-text email. Used when a trainee registers or a new staff is created by a super admin.
     */
    public void sendSimpleEmail(String to, String subject, String body) {
        requireMailSender();
        String sender = resolveSender();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);
            mailSender.send(message);
            log.info("Sent simple email successfully to {} with subject '{}'", sanitizeForLog(to), sanitizeForLog(subject)); // nosemgrep
        } catch (MessagingException e) {
            log.error("Failed to send simple email to {} with subject '{}': {}", sanitizeForLog(to), sanitizeForLog(subject), sanitizeForLog(e.getMessage())); // nosemgrep
            throw new EmailSendException("Failed to send email", e);
        }
    }

    /**
     * Send an email with an attachment.
     */
    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String fileName) {
        requireMailSender();
        String sender = resolveSender();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);
            helper.addAttachment(fileName, new ByteArrayResource(attachment));
            mailSender.send(message);
            log.info("Sent email with attachment '{}' successfully to {} with subject '{}'", sanitizeForLog(fileName), sanitizeForLog(to), sanitizeForLog(subject)); // nosemgrep
        } catch (MessagingException e) {
            log.error("Failed to send email with attachment to {} with subject '{}': {}", sanitizeForLog(to), sanitizeForLog(subject), sanitizeForLog(e.getMessage())); // nosemgrep
            throw new EmailSendException("Failed to send email with attachment", e);
        }
    }

    private void requireMailSender() {
        if (mailSender == null) {
            throw new EmailSendException("SMTP mail sender is not configured. Set spring.mail.host or use Resend (app.email.provider=resend).", null);
        }
    }

    private String resolveSender() {
        if (from != null && !from.isBlank()) {
            return from;
        }
        if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl impl) {
            String username = impl.getUsername();
            if (username != null && !username.isBlank()) {
                return username;
            }
        }
        throw new EmailSendException(
            "Mail sender address is not configured. Ensure GMAIL_USER (or spring.mail.username) is set and passed to the JVM. " +
            "When running from IDE/Maven, add the env vars to the run configuration.",
            null
        );
    }

    private static String sanitizeForLog(String value) {
        if (value == null) return null;
        // Prevent log injection by removing newlines/control chars.
        return value.replaceAll("[\\r\\n]", " ");
    }
}
