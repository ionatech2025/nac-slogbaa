package com.nac.slogbaa.reporting.application.dto;

import java.util.List;

public record TraineeProgressReportData(
    ReportHeader header,
    TraineeProgressStats summaryStats,
    List<WithdrawalLogTableRow> withdrawalLogs,
    List<EnrollmentByCourseTableRow> enrollmentByCourseTable,
    SimpleChartData completionDonutChart
) {}
