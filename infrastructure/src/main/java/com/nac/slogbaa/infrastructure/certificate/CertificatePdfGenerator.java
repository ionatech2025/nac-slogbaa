package com.nac.slogbaa.infrastructure.certificate;

import com.nac.slogbaa.shared.ports.CertificatePdfGeneratorPort;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.stream.Collectors;

/**
 * Generates certificate PDFs using OpenHTMLtoPDF.
 */
@Component
public class CertificatePdfGenerator implements CertificatePdfGeneratorPort {

    @Override
    public byte[] generatePdf(CertificatePdfData data) {
        String html = buildHtml(data);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            com.openhtmltopdf.pdfboxout.PdfRendererBuilder builder =
                new com.openhtmltopdf.pdfboxout.PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(out);
            builder.run();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }
    }

    private String buildHtml(CertificatePdfData d) {
        String modulesList = d.moduleTitles().isEmpty()
                ? "<p>All course modules completed.</p>"
                : "<ul>" + d.moduleTitles().stream()
                        .map(m -> "<li>" + escape(m) + "</li>")
                        .collect(Collectors.joining()) + "</ul>";
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8"/>
                <style>
                    body { font-family: 'Helvetica', Arial, sans-serif; margin: 40px; color: #333; }
                    .cert { border: 3px solid #f18625; padding: 40px; text-align: center; }
                    h1 { color: #f18625; font-size: 28px; margin-bottom: 10px; }
                    .name { font-size: 24px; font-weight: bold; margin: 20px 0; }
                    .course { font-size: 18px; margin: 10px 0; }
                    .score { font-size: 16px; margin: 15px 0; }
                    .modules { text-align: left; margin: 25px 20px; font-size: 14px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="cert">
                    <h1>Certificate of Completion</h1>
                    <p class="name">%s</p>
                    <p class="course">has successfully completed</p>
                    <p class="course"><strong>%s</strong></p>
                    <p class="score">Final score: %d%%</p>
                    <p class="score">Certificate number: %s</p>
                    <p class="score">Date: %s</p>
                    <div class="modules">
                        <p><strong>Modules completed:</strong></p>
                        %s
                    </div>
                    <p class="footer">SLOGBAA - Local Governance and Budget Accountability</p>
                </div>
            </body>
            </html>
            """.formatted(
                escape(d.traineeName()),
                escape(d.courseTitle()),
                d.finalScorePercent(),
                escape(d.certificateNumber()),
                escape(d.issuedDate()),
                modulesList
            );
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
