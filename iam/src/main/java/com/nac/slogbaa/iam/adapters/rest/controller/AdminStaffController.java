package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.command.CreateStaffCommand;
import com.nac.slogbaa.iam.application.dto.result.CreateStaffResult;
import com.nac.slogbaa.iam.application.port.in.CreateStaffUseCase;
import com.nac.slogbaa.iam.application.port.in.DeleteStaffUseCase;
import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.dto.command.UpdateStaffProfileCommand;
import com.nac.slogbaa.iam.application.port.in.SetStaffActiveUseCase;
import com.nac.slogbaa.iam.application.port.in.SetStaffPasswordByAdminUseCase;
import com.nac.slogbaa.iam.application.port.in.UpdateStaffProfileByAdminUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.request.CreateStaffRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.request.SetPasswordByAdminRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.request.SetStaffActiveRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.request.UpdateStaffProfileRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.response.CreateStaffResponse;
import com.nac.slogbaa.iam.adapters.rest.dto.response.StaffProfileResponse;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
    private final GetStaffByIdUseCase getStaffByIdUseCase;
    private final SetStaffPasswordByAdminUseCase setStaffPasswordByAdminUseCase;
    private final SetStaffActiveUseCase setStaffActiveUseCase;
    private final UpdateStaffProfileByAdminUseCase updateStaffProfileByAdminUseCase;

    public AdminStaffController(CreateStaffUseCase createStaffUseCase,
                                DeleteStaffUseCase deleteStaffUseCase,
                                GetStaffByIdUseCase getStaffByIdUseCase,
                                SetStaffPasswordByAdminUseCase setStaffPasswordByAdminUseCase,
                                SetStaffActiveUseCase setStaffActiveUseCase,
                                UpdateStaffProfileByAdminUseCase updateStaffProfileByAdminUseCase) {
        this.createStaffUseCase = createStaffUseCase;
        this.deleteStaffUseCase = deleteStaffUseCase;
        this.getStaffByIdUseCase = getStaffByIdUseCase;
        this.setStaffPasswordByAdminUseCase = setStaffPasswordByAdminUseCase;
        this.setStaffActiveUseCase = setStaffActiveUseCase;
        this.updateStaffProfileByAdminUseCase = updateStaffProfileByAdminUseCase;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<StaffProfileResponse> getStaff(@PathVariable UUID id) {
        return getStaffByIdUseCase.getById(id)
                .map(dto -> new StaffProfileResponse(
                        dto.getId(),
                        dto.getFullName(),
                        dto.getEmail(),
                        dto.getRole(),
                        dto.isActive()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

    @PostMapping("/{id}/password")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> setStaffPassword(@PathVariable UUID id,
                                                  @Valid @RequestBody SetPasswordByAdminRequest request) {
        setStaffPasswordByAdminUseCase.setPassword(id, request.newPassword());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/active")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> setStaffActive(@PathVariable UUID id,
                                               @Valid @RequestBody SetStaffActiveRequest request) {
        setStaffActiveUseCase.setActive(id, request.active());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> updateStaffProfile(@PathVariable UUID id,
                                                   @Valid @RequestBody UpdateStaffProfileRequest request) {
        UpdateStaffProfileCommand command = new UpdateStaffProfileCommand(request.fullName(), request.email());
        updateStaffProfileByAdminUseCase.update(id, command);
        return ResponseEntity.noContent().build();
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
