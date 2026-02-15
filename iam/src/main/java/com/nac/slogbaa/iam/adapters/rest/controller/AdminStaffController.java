package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.command.CreateStaffCommand;
import com.nac.slogbaa.iam.application.dto.result.CreateStaffResult;
import com.nac.slogbaa.iam.application.port.in.CreateStaffUseCase;
import com.nac.slogbaa.iam.application.port.in.DeleteStaffUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.request.CreateStaffRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.response.CreateStaffResponse;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * REST controller for admin staff management. Create and delete are SUPER_ADMIN only.
 */
@RestController
@RequestMapping("/api/admin/staff")
public class AdminStaffController {

    private final CreateStaffUseCase createStaffUseCase;
    private final DeleteStaffUseCase deleteStaffUseCase;

    public AdminStaffController(CreateStaffUseCase createStaffUseCase,
                                DeleteStaffUseCase deleteStaffUseCase) {
        this.createStaffUseCase = createStaffUseCase;
        this.deleteStaffUseCase = deleteStaffUseCase;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<CreateStaffResponse> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        CreateStaffCommand command = new CreateStaffCommand(
                request.getFullName(),
                request.getEmail(),
                request.getRole(),
                request.getPassword()
        );
        CreateStaffResult result = createStaffUseCase.create(command);
        CreateStaffResponse response = new CreateStaffResponse(
                result.getStaffId().toString(),
                result.getEmail(),
                result.getFullName(),
                result.getRole()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteStaff(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID id) {
        deleteStaffUseCase.delete(id, identity.getUserId());
        return ResponseEntity.noContent().build();
    }
}
