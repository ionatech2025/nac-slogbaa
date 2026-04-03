package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedRole;
import com.nac.slogbaa.learning.application.dto.result.LibraryResourceSummary;
import com.nac.slogbaa.learning.application.port.in.GetPublishedLibraryResourcesUseCase;
import com.nac.slogbaa.learning.adapters.rest.dto.response.LibraryResourceSummaryResponse;
import com.nac.slogbaa.shared.ports.TraineeEnrollmentQueryPort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for published library resources. Secured for TRAINEE and STAFF.
 */
@RestController
@RequestMapping("/api/library")
public class LibraryResourceController {

    private final GetPublishedLibraryResourcesUseCase getPublishedLibraryResourcesUseCase;
    private final TraineeEnrollmentQueryPort traineeEnrollmentQueryPort;

    public LibraryResourceController(GetPublishedLibraryResourcesUseCase getPublishedLibraryResourcesUseCase,
                                   TraineeEnrollmentQueryPort traineeEnrollmentQueryPort) {
        this.getPublishedLibraryResourcesUseCase = getPublishedLibraryResourcesUseCase;
        this.traineeEnrollmentQueryPort = traineeEnrollmentQueryPort;
    }

    @GetMapping("/resources")
    @PreAuthorize("hasAnyRole('TRAINEE','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<LibraryResourceSummaryResponse>> getPublishedResources(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        
        List<LibraryResourceSummary> summaries;

        // If it is a trainee, filter by their enrolled courses
        if (identity.getRole() == AuthenticatedRole.TRAINEE) {
            List<UUID> enrolledCourseIds = traineeEnrollmentQueryPort.getEnrolledCourseIds(identity.getUserId());
            summaries = getPublishedLibraryResourcesUseCase.getPublishedResources(enrolledCourseIds);
        } else {
            // Staff see everything published
            summaries = getPublishedLibraryResourcesUseCase.getPublishedResources();
        }

        List<LibraryResourceSummaryResponse> response = summaries.stream()
                .map(LibraryResourceSummaryResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }
}
