package com.nac.slogbaa.reporting.infrastructure.adapter.out.persistence;

import com.nac.slogbaa.reporting.application.dto.*;
import com.nac.slogbaa.reporting.application.port.out.ReportDataQueryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Dummy adapter returning mock data.
 * TODO: Replace with real SQL/JPA projections.
 */
@Component
public class DummyReportDataQueryAdapter implements ReportDataQueryPort {

    @Override
    public ExecutiveOverviewReportData fetchExecutiveOverviewData() {
        ReportHeader header = new ReportHeader("Executive Overview", "System", "Now", "All Time");
        PlatformSummaryStats stats = new PlatformSummaryStats("15,000", "120", "75%", "450");
        SimpleChartData pie = new SimpleChartData("Status", List.of("Active", "Completed", "Withdrawn"), List.of(5000.0, 9500.0, 500.0));
        SimpleChartData bar = new SimpleChartData("Districts", List.of("North", "South", "East", "West"), List.of(4000.0, 3000.0, 5000.0, 3000.0));
        
        return new ExecutiveOverviewReportData(header, stats, pie, bar);
    }

    @Override
    public CourseAnalyticsReportData fetchCourseAnalyticsData() {
        ReportHeader header = new ReportHeader("Course Analytics", "System", "Now", "All Time");
        CourseSummaryStats stats = new CourseSummaryStats(120, 450, "4.2 / 5.0");
        MultiSeriesChartData chart = new MultiSeriesChartData(List.of("Jan", "Feb", "Mar"), Map.of("Enrolled", List.of(100.0, 200.0, 150.0)));
        List<CoursePerformanceTableRow> table = List.of(
                new CoursePerformanceTableRow("C1", "Java Basics", 500, "80%", "4.5"),
                new CoursePerformanceTableRow("C2", "Spring Boot", 300, "60%", "4.8")
        );
        
        return new CourseAnalyticsReportData(header, stats, chart, table);
    }

    @Override
    public TraineeProgressReportData fetchTraineeProgressData() {
        ReportHeader header = new ReportHeader("Trainee Progress", "System", "Now", "All Time");
        TraineeProgressStats stats = new TraineeProgressStats("45 Days", "12.4%");
        List<WithdrawalLogTableRow> logs = List.of(
                new WithdrawalLogTableRow("2026-05-01", "John Doe", "Java Basics", "Too hard")
        );
        
        return new TraineeProgressReportData(header, stats, logs);
    }
}
