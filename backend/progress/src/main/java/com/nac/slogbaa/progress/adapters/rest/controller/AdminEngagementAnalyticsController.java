package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedRole;
import com.nac.slogbaa.progress.application.dto.EngagementAnalyticsResponse;
import com.nac.slogbaa.progress.application.port.in.GetEngagementAnalyticsUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminEngagementAnalyticsController {

    private final GetEngagementAnalyticsUseCase getEngagementAnalyticsUseCase;

    public AdminEngagementAnalyticsController(GetEngagementAnalyticsUseCase getEngagementAnalyticsUseCase) {
        this.getEngagementAnalyticsUseCase = getEngagementAnalyticsUseCase;
    }

    @GetMapping("/engagement")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<EngagementAnalyticsResponse> engagement(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        boolean superMetrics = identity.getRole() == AuthenticatedRole.SUPER_ADMIN;
        return ResponseEntity.ok(getEngagementAnalyticsUseCase.get(superMetrics));
    }
}
