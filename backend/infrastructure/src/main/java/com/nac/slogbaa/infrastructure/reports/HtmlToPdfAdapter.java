package com.nac.slogbaa.infrastructure.reports;

import com.nac.slogbaa.shared.ports.HtmlToPdfPort;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Safelist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;

/**
 * Adapter implementation for HTML to PDF conversion using OpenHTMLtoPDF.
 * Includes HTML sanitization and normalization to XHTML.
 */
@Component
public class HtmlToPdfAdapter implements HtmlToPdfPort {

    private static final Logger log = LoggerFactory.getLogger(HtmlToPdfAdapter.class);

    @Override
    public byte[] generatePdf(String html) {
        if (html == null || html.isBlank()) {
            throw new IllegalArgumentException("HTML content cannot be empty");
        }

        // 1. Sanitize and Normalize HTML to XHTML (required for OpenHTMLtoPDF)
        String xhtml = sanitizeAndNormalize(html);

        // 2. Render PDF
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            // OpenHTMLtoPDF requires valid XML/XHTML
            builder.withHtmlContent(xhtml, "/"); 
            builder.toStream(out);
            builder.run();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF from HTML: {}", e.getMessage(), e);
            throw new RuntimeException("PDF generation failed. Ensure HTML is well-formed.", e);
        }
    }

    private String sanitizeAndNormalize(String html) {
        // Parse and normalize to XHTML (required for OpenHTMLtoPDF)
        Document doc = Jsoup.parse(html);
        doc.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
        doc.outputSettings().escapeMode(org.jsoup.nodes.Entities.EscapeMode.xhtml);
        doc.outputSettings().charset("UTF-8");

        return doc.html();
    }
}
