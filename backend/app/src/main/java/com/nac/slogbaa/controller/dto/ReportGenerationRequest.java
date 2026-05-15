package com.nac.slogbaa.controller.dto;

/**
 * Data transfer object for report generation requests.
 */
public record ReportGenerationRequest(
    String html,
    String title,
    String generatedBy,
    String generatedAt
) {}
