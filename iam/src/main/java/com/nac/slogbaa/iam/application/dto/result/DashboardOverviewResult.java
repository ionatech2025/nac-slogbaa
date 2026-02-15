package com.nac.slogbaa.iam.application.dto.result;

import java.util.List;

/**
 * Result of admin dashboard overview: counts and lists of staff and trainees.
 * No framework dependency.
 */
public final class DashboardOverviewResult {
    private final long staffCount;
    private final long traineeCount;
    private final List<StaffSummaryDto> staff;
    private final List<TraineeSummaryDto> trainees;

    public DashboardOverviewResult(long staffCount, long traineeCount,
                                   List<StaffSummaryDto> staff,
                                   List<TraineeSummaryDto> trainees) {
        this.staffCount = staffCount;
        this.traineeCount = traineeCount;
        this.staff = staff != null ? List.copyOf(staff) : List.of();
        this.trainees = trainees != null ? List.copyOf(trainees) : List.of();
    }

    public long getStaffCount() { return staffCount; }
    public long getTraineeCount() { return traineeCount; }
    public List<StaffSummaryDto> getStaff() { return staff; }
    public List<TraineeSummaryDto> getTrainees() { return trainees; }
}
