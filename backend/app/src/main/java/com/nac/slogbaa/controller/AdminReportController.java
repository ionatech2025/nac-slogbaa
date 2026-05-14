package com.nac.slogbaa.controller;

import com.nac.slogbaa.controller.dto.ReportGenerationRequest;
import com.nac.slogbaa.service.ReportGenerationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Controller for handling platform reporting requests.
 * Restricted to SUPER_ADMIN users.
 */
@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    private final ReportGenerationService reportGenerationService;
    private static final Logger log = LoggerFactory.getLogger(AdminReportController.class);

    public AdminReportController(ReportGenerationService reportGenerationService) {
        this.reportGenerationService = reportGenerationService;
    }

    /**
     * Accepts an HTML payload and metadata to trigger report processing.
     * This endpoint is highly restricted as it handles raw HTML strings.
     *
     * @param request The report generation request payload.
     * @return Confirmation of receipt and processing status.
     */
    @PostMapping("/generate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<byte[]> generateReport(@RequestBody ReportGenerationRequest request) {
        log.info("Report generation requested: title='{}', generatedBy='{}', htmlLength={}", 
            request.title(), request.generatedBy(), 
            request.html() != null ? request.html().length() : 0);

        // 1. Generate PDF bytes
        byte[] pdfBytes = reportGenerationService.generateReportBytes(request.html());

        // 2. Prepare filename
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String safeTitle = (request.title() != null ? request.title() : "platform_report")
                .replaceAll("[^a-zA-Z0-9]", "_")
                .toLowerCase();
        String filename = String.format("report_%s_%s.pdf", safeTitle, timestamp);

        // 3. Store in background (optional, but good for persistence)
        // We'll let the service handle the storage as well if needed, 
        // but for immediate download, we return the bytes.
        reportGenerationService.storeReportAsync(pdfBytes, filename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
