package com.nac.slogbaa.shared.ports;

/**
 * Port for generating certificate PDFs.
 */
public interface CertificatePdfGeneratorPort {

    /**
     * Generate a certificate PDF.
     *
     * @param data certificate data for the PDF content
     * @return PDF bytes
     */
    byte[] generatePdf(CertificatePdfData data);

    record CertificatePdfData(
            String traineeName,
            String courseTitle,
            String certificateNumber,
            String issuedDate,
            int finalScorePercent,
            java.util.List<String> moduleTitles
    ) {}
}
