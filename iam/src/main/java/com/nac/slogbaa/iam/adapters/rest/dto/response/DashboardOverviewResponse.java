package com.nac.slogbaa.iam.adapters.rest.dto.response;

import java.util.List;

/**
 * REST response: admin dashboard overview (counts and lists).
 */
public record DashboardOverviewResponse(
        long staffCount,
        long traineeCount,
        List<StaffSummaryResponse> staff,
        List<TraineeSummaryResponse> trainees
) {}
