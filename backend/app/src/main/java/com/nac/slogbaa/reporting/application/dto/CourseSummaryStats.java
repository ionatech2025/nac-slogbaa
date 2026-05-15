package com.nac.slogbaa.reporting.application.dto;

public record CourseSummaryStats(
    int totalCourses,
    int totalModules,
    String platformAverageRating
) {}
