package com.nac.slogbaa.reporting.application.dto;

public record AssessmentTableRow(
    String courseName,
    String quizTitle,
    String traineeName,
    String attemptStatus, // e.g. "Passed" or "Failed"
    String dateAttempted,
    boolean certificateIssued,
    String certificateDate
) {}
