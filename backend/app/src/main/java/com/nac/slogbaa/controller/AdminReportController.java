package com.nac.slogbaa.controller;

import com.nac.slogbaa.controller.dto.ReportGenerationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controller for handling platform reporting requests.
 * Restricted to SUPER_ADMIN users.
 */
@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    private static final Logger log = LoggerFactory.getLogger(AdminReportController.class);

    /**
     * Accepts an HTML payload and metadata to trigger report processing.
     * This endpoint is highly restricted as it handles raw HTML strings.
     *
     * @param request The report generation request payload.
     * @return Confirmation of receipt and processing status.
     */
    @PostMapping("/generate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> generateReport(@RequestBody ReportGenerationRequest request) {
        log.info("Report generation requested: title='{}', generatedBy='{}', htmlLength={}", 
            request.title(), request.generatedBy(), 
            request.html() != null ? request.html().length() : 0);

        // Security Note: In a production environment, the HTML string should be 
        // sanitized or processed through a secure PDF engine (like Playwright, iText, or Flying Saucer)
        // to prevent XSS or server-side resource exhaustion.

        // Placeholder for actual PDF generation logic:
        // byte[] pdfBytes = pdfService.generate(request.html());
        // fileStorage.store(pdfBytes, ...);

        return ResponseEntity.ok(Map.of(
            "message", "Report generation request received successfully",
            "title", request.title(),
            "timestamp", request.generatedAt(),
            "status", "PENDING_PROCESSING"
        ));
    }
}
