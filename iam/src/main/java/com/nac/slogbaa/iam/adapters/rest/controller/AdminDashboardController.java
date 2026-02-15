package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.result.DashboardOverviewResult;
import com.nac.slogbaa.iam.application.dto.result.StaffSummaryDto;
import com.nac.slogbaa.iam.application.dto.result.TraineeSummaryDto;
import com.nac.slogbaa.iam.application.port.in.GetAdminDashboardOverviewUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.response.DashboardOverviewResponse;
import com.nac.slogbaa.iam.adapters.rest.dto.response.StaffSummaryResponse;
import com.nac.slogbaa.iam.adapters.rest.dto.response.TraineeSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for admin dashboard. Secured for ADMIN and SUPER_ADMIN.
 */
@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final GetAdminDashboardOverviewUseCase getAdminDashboardOverviewUseCase;

    public AdminDashboardController(GetAdminDashboardOverviewUseCase getAdminDashboardOverviewUseCase) {
        this.getAdminDashboardOverviewUseCase = getAdminDashboardOverviewUseCase;
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<DashboardOverviewResponse> getOverview() {
        DashboardOverviewResult result = getAdminDashboardOverviewUseCase.getOverview();
        List<StaffSummaryResponse> staff = result.getStaff().stream()
                .map(dto -> new StaffSummaryResponse(dto.getId(), dto.getFullName(), dto.getEmail(), dto.getRole()))
                .toList();
        List<TraineeSummaryResponse> trainees = result.getTrainees().stream()
                .map(dto -> new TraineeSummaryResponse(dto.getId(), dto.getFullName(), dto.getEmail(), dto.getDistrictName()))
                .toList();
        return ResponseEntity.ok(new DashboardOverviewResponse(
                result.getStaffCount(),
                result.getTraineeCount(),
                staff,
                trainees
        ));
    }
}
