package com.nac.slogbaa.reporting.application.port.out;

import com.nac.slogbaa.reporting.application.dto.CourseAnalyticsReportData;
import com.nac.slogbaa.reporting.application.dto.ExecutiveOverviewReportData;
import com.nac.slogbaa.reporting.application.dto.TraineeProgressReportData;

public interface ReportDataQueryPort {
    ExecutiveOverviewReportData fetchExecutiveOverviewData();
    CourseAnalyticsReportData fetchCourseAnalyticsData();
    TraineeProgressReportData fetchTraineeProgressData();
}
