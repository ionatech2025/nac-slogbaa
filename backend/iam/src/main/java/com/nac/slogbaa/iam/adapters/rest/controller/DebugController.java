package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.adapters.rest.dto.request.TestEmailRequest;
import com.nac.slogbaa.infrastructure.email.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Endpoint for debugging and system-wide tests.
 * Restricted to SUPER_ADMIN users for safety.
 */
@RestController
@RequestMapping("/api/internal/debug/mail")
@RequiredArgsConstructor
@Slf4j
public class DebugController {

    private final EmailService emailService;

    /**
     * Send a test email via SMTP or the current active provider.
     * Use POST /api/internal/debug/mail/test-smtp
     */
    @PostMapping("/test-smtp")
    public ResponseEntity<?> testSmtp(@Valid @RequestBody TestEmailRequest request) {
        log.info("Debugging: trigger test email to {} (subject: {})", request.getTo(), request.getSubject());
        
        try {
            emailService.sendHtmlEmail(request.getTo(), request.getSubject(), request.getContent());
            return ResponseEntity.ok(Map.of(
                "message", "Test email sequence initiated successfully",
                "to", request.getTo(),
                "status", "Delivered"
            ));
        } catch (Exception e) {
            log.error("Failed to trigger debug email: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Email sending failed",
                "details", e.getMessage()
            ));
        }
    }
}
