package com.nac.slogbaa.reporting.application.dto;

public record PlatformSummaryStats(
    String totalTrainees,
    String activeCourses,
    String overallCompletionRate,
    String totalWithdrawals
) {}
