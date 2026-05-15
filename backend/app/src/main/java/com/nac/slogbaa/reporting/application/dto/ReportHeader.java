package com.nac.slogbaa.reporting.application.dto;

public record ReportHeader(
    String reportTitle,
    String generatedBy,
    String generatedAtFormatted,
    String filterCriteriaDescription
) {}
