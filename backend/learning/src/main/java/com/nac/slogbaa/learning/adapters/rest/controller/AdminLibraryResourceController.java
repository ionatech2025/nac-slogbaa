package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.learning.adapters.rest.dto.request.CreateLibraryResourceRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.UpdateLibraryResourceRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.response.AdminLibraryResourceSummaryResponse;
import com.nac.slogbaa.learning.application.dto.command.CreateLibraryResourceCommand;
import com.nac.slogbaa.learning.application.dto.command.UpdateLibraryResourceCommand;
import com.nac.slogbaa.learning.application.dto.result.AdminLibraryResourceSummary;
import com.nac.slogbaa.learning.application.port.in.CreateLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.in.GetAdminLibraryResourcesUseCase;
import com.nac.slogbaa.learning.application.port.in.PublishLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.in.UnpublishLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.in.UpdateLibraryResourceUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for admin library resource management. SuperAdmin only for create/publish.
 */
@RestController
@RequestMapping("/api/admin/library")
public class AdminLibraryResourceController {

    private final GetAdminLibraryResourcesUseCase getAdminLibraryResourcesUseCase;
    private final CreateLibraryResourceUseCase createLibraryResourceUseCase;
    private final PublishLibraryResourceUseCase publishLibraryResourceUseCase;
    private final UnpublishLibraryResourceUseCase unpublishLibraryResourceUseCase;
    private final UpdateLibraryResourceUseCase updateLibraryResourceUseCase;

    public AdminLibraryResourceController(GetAdminLibraryResourcesUseCase getAdminLibraryResourcesUseCase,
                                         CreateLibraryResourceUseCase createLibraryResourceUseCase,
                                         PublishLibraryResourceUseCase publishLibraryResourceUseCase,
                                         UnpublishLibraryResourceUseCase unpublishLibraryResourceUseCase,
                                         UpdateLibraryResourceUseCase updateLibraryResourceUseCase) {
        this.getAdminLibraryResourcesUseCase = getAdminLibraryResourcesUseCase;
        this.createLibraryResourceUseCase = createLibraryResourceUseCase;
        this.publishLibraryResourceUseCase = publishLibraryResourceUseCase;
        this.unpublishLibraryResourceUseCase = unpublishLibraryResourceUseCase;
        this.updateLibraryResourceUseCase = updateLibraryResourceUseCase;
    }

    @GetMapping("/resources")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<AdminLibraryResourceSummaryResponse>> getAll() {
        List<AdminLibraryResourceSummary> list = getAdminLibraryResourcesUseCase.getAll();
        return ResponseEntity.ok(list.stream().map(AdminLibraryResourceSummaryResponse::from).toList());
    }

    @PostMapping("/resources")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AdminLibraryResourceSummaryResponse> create(
            @Valid @RequestBody CreateLibraryResourceRequest request,
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        CreateLibraryResourceCommand command = new CreateLibraryResourceCommand(
                request.title(),
                request.description(),
                request.resourceType(),
                request.fileUrl(),
                request.fileType(),
                identity.getUserId()
        );
        AdminLibraryResourceSummary created = createLibraryResourceUseCase.create(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(AdminLibraryResourceSummaryResponse.from(created));
    }

    @PutMapping("/resources/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> update(@PathVariable UUID id,
                                        @Valid @RequestBody UpdateLibraryResourceRequest request) {
        UpdateLibraryResourceCommand command = new UpdateLibraryResourceCommand(
                request.title(),
                request.description(),
                request.resourceType(),
                request.fileUrl(),
                request.fileType()
        );
        updateLibraryResourceUseCase.update(id, command);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/resources/{id}/publish")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> publish(@PathVariable UUID id) {
        publishLibraryResourceUseCase.publish(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/resources/{id}/unpublish")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> unpublish(@PathVariable UUID id) {
        unpublishLibraryResourceUseCase.unpublish(id);
        return ResponseEntity.noContent().build();
    }
}
