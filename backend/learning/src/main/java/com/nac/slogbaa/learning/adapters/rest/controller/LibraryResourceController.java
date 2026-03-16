package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.learning.application.dto.result.LibraryResourceSummary;
import com.nac.slogbaa.learning.application.port.in.GetPublishedLibraryResourcesUseCase;
import com.nac.slogbaa.learning.adapters.rest.dto.response.LibraryResourceSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for published library resources. Secured for TRAINEE and STAFF.
 */
@RestController
@RequestMapping("/api/library")
public class LibraryResourceController {

    private final GetPublishedLibraryResourcesUseCase getPublishedLibraryResourcesUseCase;

    public LibraryResourceController(GetPublishedLibraryResourcesUseCase getPublishedLibraryResourcesUseCase) {
        this.getPublishedLibraryResourcesUseCase = getPublishedLibraryResourcesUseCase;
    }

    @GetMapping("/resources")
    @PreAuthorize("hasAnyRole('TRAINEE','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<LibraryResourceSummaryResponse>> getPublishedResources() {
        List<LibraryResourceSummary> summaries = getPublishedLibraryResourcesUseCase.getPublishedResources();
        List<LibraryResourceSummaryResponse> response = summaries.stream()
                .map(LibraryResourceSummaryResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }
}
