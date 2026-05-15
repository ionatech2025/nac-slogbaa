package com.nac.slogbaa.reporting.application.dto;

public record ExecutiveOverviewReportData(
    ReportHeader header,
    PlatformSummaryStats summaryStats,
    SimpleChartData traineeStatusPieChart,
    SimpleChartData topDistrictsBarChart
) {}
