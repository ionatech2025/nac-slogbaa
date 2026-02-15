package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.command.CreateStaffCommand;
import com.nac.slogbaa.iam.application.dto.result.CreateStaffResult;
import com.nac.slogbaa.iam.application.port.in.CreateStaffUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.request.CreateStaffRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.response.CreateStaffResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for admin staff management. Create staff is SUPER_ADMIN only.
 */
@RestController
@RequestMapping("/api/admin/staff")
public class AdminStaffController {

    private final CreateStaffUseCase createStaffUseCase;

    public AdminStaffController(CreateStaffUseCase createStaffUseCase) {
        this.createStaffUseCase = createStaffUseCase;
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
}
