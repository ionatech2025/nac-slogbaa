package com.nac.slogbaa.infrastructure.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Email service using Resend HTTP API (https://resend.com).
 * Activated when {@code app.email.provider=resend} is set.
 * Bypasses SMTP entirely — works on Render, Railway, and other hosts that block SMTP ports.
 */
@Service
@Primary
@ConditionalOnProperty(name = "app.email.provider", havingValue = "resend")
// @Profile("prod")
public class ResendEmailService extends EmailService {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final String apiKey;
    private final String from;
    private final boolean enabled;
    private final HttpClient httpClient;

    private static String sanitizeForLog(String value) {
        if (value == null) return null;
        // Prevent log injection by removing newlines/control chars.
        return value.replaceAll("[\\r\\n]", " ");
    }

    public ResendEmailService(
            org.springframework.beans.factory.ObjectProvider<org.springframework.mail.javamail.JavaMailSender> mailSenderProvider,
            @Value("${app.email.resend.api-key}") String apiKey,
            @Value("${app.email.resend.from:SLOGBAA <onboarding@resend.dev>}") String from,
            @Value("${app.email.enabled:true}") boolean enabled) {
        super(mailSenderProvider, enabled); // not used — all methods overridden
        this.apiKey = apiKey;
        this.from = from;
        this.enabled = enabled;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        log.info("Resend email service initialized — from={}, enabled={}", sanitizeForLog(from), enabled); // nosemgrep
    }

    @Override
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        send(to, subject, htmlContent);
    }

    @Override
    public void sendSimpleEmail(String to, String subject, String body) {
        // Wrap plain text in minimal HTML
        send(to, subject, "<pre style=\"font-family:sans-serif;white-space:pre-wrap\">" + escapeHtml(body) + "</pre>");
    }

    @Override
    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String fileName) {
        String base64 = java.util.Base64.getEncoder().encodeToString(attachment);
        String htmlBody = "<pre style=\"font-family:sans-serif;white-space:pre-wrap\">" + escapeHtml(body) + "</pre>";
        String json = """
            {
              "from": "%s",
              "to": ["%s"],
              "subject": "%s",
              "html": "%s",
              "attachments": [{"filename": "%s", "content": "%s"}]
            }
            """.formatted(
                escapeJson(from), escapeJson(to), escapeJson(subject),
                escapeJson(htmlBody), escapeJson(fileName), base64);

        doPost(json, to, subject);
    }

    private void send(String to, String subject, String html) {
        String json = """
            {
              "from": "%s",
              "to": ["%s"],
              "subject": "%s",
              "html": "%s"
            }
            """.formatted(escapeJson(from), escapeJson(to), escapeJson(subject), escapeJson(html));

        doPost(json, to, subject);
    }

    private void doPost(String json, String to, String subject) {
        if (!enabled) {
            log.info("[PAUSED] Email sending is DISABLED (app.email.enabled=false). Would have sent email to '{}' with subject '{}'", 
                sanitizeForLog(to), sanitizeForLog(subject));
            return;
        }
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Resend: sent email to {} subject='{}' status={}", sanitizeForLog(to), sanitizeForLog(subject), response.statusCode()); // nosemgrep
            } else {
                String body = response.body();
                log.error("Resend: failed to send email to {} subject='{}' status={} body={}",
                        sanitizeForLog(to), sanitizeForLog(subject), response.statusCode(), sanitizeForLog(body)); // nosemgrep
                throw new EmailSendException(resendFailureMessage(response.statusCode(), body), null);
            }
        } catch (EmailSendException e) {
            throw e;
        } catch (Exception e) {
            log.error("Resend: failed to send email to {} subject='{}': {}", sanitizeForLog(to), sanitizeForLog(subject), sanitizeForLog(e.getMessage())); // nosemgrep
            throw new EmailSendException("Failed to send email via Resend: " + e.getMessage(), e);
        }
    }

    /**
     * Resend returns JSON such as {@code {"message":"...","name":"validation_error"}}.
     * Surface it so admins see why 403 happened (domain / from address / test-only recipient).
     */
    private static String resendFailureMessage(int statusCode, String body) {
        String base = "Resend API error: " + statusCode;
        if (body == null || body.isBlank()) {
            return base;
        }
        String oneLine = body.replace('\r', ' ').replace('\n', ' ').trim();
        if (oneLine.length() > 500) {
            oneLine = oneLine.substring(0, 500) + "…";
        }
        return base + " — " + oneLine;
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
