package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.result.DashboardOverviewResult;
import com.nac.slogbaa.iam.application.dto.result.StaffSummaryDto;
import com.nac.slogbaa.iam.application.dto.result.TraineeSummaryDto;
import com.nac.slogbaa.iam.application.port.in.GetAdminDashboardOverviewUseCase;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Application service: build admin dashboard overview from repository data.
 * No framework dependency in logic.
 */
public class GetAdminDashboardOverviewService implements GetAdminDashboardOverviewUseCase {

    private final StaffUserRepositoryPort staffUserRepository;
    private final TraineeRepositoryPort traineeRepository;

    public GetAdminDashboardOverviewService(StaffUserRepositoryPort staffUserRepository,
                                            TraineeRepositoryPort traineeRepository) {
        this.staffUserRepository = staffUserRepository;
        this.traineeRepository = traineeRepository;
    }

    @Override
    public DashboardOverviewResult getOverview() {
        long staffCount = staffUserRepository.count();
        long traineeCount = traineeRepository.count();
        List<StaffSummaryDto> staff = staffUserRepository.findAll().stream()
                .map(this::toStaffSummary)
                .collect(Collectors.toList());
        List<TraineeSummaryDto> trainees = traineeRepository.findAll().stream()
                .map(this::toTraineeSummary)
                .collect(Collectors.toList());
        return new DashboardOverviewResult(staffCount, traineeCount, staff, trainees);
    }

    private StaffSummaryDto toStaffSummary(StaffUser u) {
        return new StaffSummaryDto(
                u.getId().getValue().toString(),
                u.getFullName(),
                u.getEmail().getValue(),
                u.getStaffRole().name()
        );
    }

    private TraineeSummaryDto toTraineeSummary(Trainee t) {
        return new TraineeSummaryDto(
                t.getId().getValue().toString(),
                t.getProfile().getFullName().getFullName(),
                t.getEmail().getValue(),
                t.getProfile().getDistrict().getName()
        );
    }
}
