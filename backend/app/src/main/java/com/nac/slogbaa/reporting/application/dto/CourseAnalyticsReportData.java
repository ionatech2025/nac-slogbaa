package com.nac.slogbaa.reporting.application.dto;

import java.util.List;

public record CourseAnalyticsReportData(
    ReportHeader header,
    CourseSummaryStats summaryStats,
    MultiSeriesChartData enrollmentVsCompletionTrendChart,
    List<CoursePerformanceTableRow> performanceTable
) {}
