package com.nac.slogbaa.reporting.application.dto;

public record ExecutiveOverviewReportData(
    ReportHeader header,
    PlatformSummaryStats summaryStats,
    SimpleChartData traineeStatusPieChart,
    SimpleChartData topDistrictsBarChart,
    java.util.List<StaffTableRow> staffTable,
    java.util.List<TraineeTableRow> traineeTable
) {}
