package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.result.DashboardOverviewResult;

/**
 * Use case: get admin dashboard overview (counts and lists of staff and trainees).
 * No framework dependency.
 */
public interface GetAdminDashboardOverviewUseCase {

    DashboardOverviewResult getOverview();
}
