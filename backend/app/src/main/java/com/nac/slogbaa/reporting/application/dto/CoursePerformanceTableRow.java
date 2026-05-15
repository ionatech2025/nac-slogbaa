package com.nac.slogbaa.reporting.application.dto;

public record CoursePerformanceTableRow(
    String courseId,
    String courseName,
    int enrolledCount,
    String completionPercentage,
    String averageRating
) {}
