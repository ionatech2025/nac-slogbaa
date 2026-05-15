package com.nac.slogbaa.reporting.application.port.out;

public interface PdfGeneratorPort {
    byte[] generatePdf(Object reportDataDto);
}
