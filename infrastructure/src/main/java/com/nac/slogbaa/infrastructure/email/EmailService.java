package com.nac.slogbaa.infrastructure.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

/**
 * Service for sending emails. Used when trainees register or staff are created by a super admin.
 */
@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send an HTML email.
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Sent HTML email successfully to {} with subject '{}'", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to {} with subject '{}': {}", to, subject, e.getMessage());
            throw new EmailSendException("Failed to send email", e);
        }
    }

    /**
     * Send a simple plain-text email. Used when a trainee registers or a new staff is created by a super admin.
     */
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);
            mailSender.send(message);
            log.info("Sent simple email successfully to {} with subject '{}'", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send simple email to {} with subject '{}': {}", to, subject, e.getMessage());
            throw new EmailSendException("Failed to send email", e);
        }
    }

    /**
     * Send an email with an attachment.
     */
    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String fileName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);
            helper.addAttachment(fileName, new ByteArrayResource(attachment));
            mailSender.send(message);
            log.info("Sent email with attachment '{}' successfully to {} with subject '{}'", fileName, to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email with attachment to {} with subject '{}': {}", to, subject, e.getMessage());
            throw new EmailSendException("Failed to send email with attachment", e);
        }
    }
}
