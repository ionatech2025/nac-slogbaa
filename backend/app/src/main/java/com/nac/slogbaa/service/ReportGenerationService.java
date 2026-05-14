package com.nac.slogbaa.service;

import com.nac.slogbaa.shared.ports.FileStoragePort;
import com.nac.slogbaa.shared.ports.HtmlToPdfPort;
import com.nac.slogbaa.shared.ports.file.FileUploadResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Service for generating and storing platform reports.
 * Orchestrates HTML-to-PDF conversion and persistence.
 */
@Service
public class ReportGenerationService {

    private static final Logger log = LoggerFactory.getLogger(ReportGenerationService.class);

    private final HtmlToPdfPort htmlToPdfPort;
    private final FileStoragePort fileStoragePort;

    public ReportGenerationService(HtmlToPdfPort htmlToPdfPort, FileStoragePort fileStoragePort) {
        this.htmlToPdfPort = htmlToPdfPort;
        this.fileStoragePort = fileStoragePort;
    }

    /**
     * Converts the provided HTML to PDF bytes.
     *
     * @param html The sanitized HTML content.
     * @return The PDF bytes.
     */
    public byte[] generateReportBytes(String html) {
        return htmlToPdfPort.generatePdf(html);
    }

    /**
     * Stores the PDF bytes in the system storage.
     *
     * @param pdfBytes The PDF bytes to store.
     * @param filename The filename to use.
     * @return The URL to access the stored PDF.
     */
    public String storeReportAsync(byte[] pdfBytes, String filename) {
        // Keeping it synchronous for now as the PDF generation is the main bottleneck,
        // and storage is usually fast.
        FileUploadResult result = fileStoragePort.store(
                pdfBytes,
                filename,
                "application/pdf",
                "reports"
        );
        log.info("Report stored: {}", result.url());
        return result.url();
    }

    /**
     * Converts the provided HTML to a PDF report and stores it in the system.
     * (Deprecated: use generateReportBytes and storeReportAsync for more flexibility)
     *
     * @param html  The sanitized HTML content.
     * @param title The report title.
     * @return The URL to access the generated PDF.
     */
    public String generateAndStoreReport(String html, String title) {
        log.info("Starting report generation: {}", title);

        byte[] pdfBytes = generateReportBytes(html);

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String safeTitle = (title != null ? title : "platform_report")
                .replaceAll("[^a-zA-Z0-9]", "_")
                .toLowerCase();
        String filename = String.format("report_%s_%s.pdf", safeTitle, timestamp);

        return storeReportAsync(pdfBytes, filename);
    }
}
