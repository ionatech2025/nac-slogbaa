package com.nac.slogbaa.shared.ports;

/**
 * Port for converting HTML strings to PDF documents.
 * This is used for platform reports and other dynamic documents.
 */
public interface HtmlToPdfPort {

    /**
     * Generates a PDF byte array from the provided HTML string.
     *
     * @param html The HTML content to render.
     * @return PDF byte array.
     */
    byte[] generatePdf(String html);
}
