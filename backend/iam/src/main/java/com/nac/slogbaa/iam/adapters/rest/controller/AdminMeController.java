package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.command.ChangeStaffPasswordCommand;
import com.nac.slogbaa.iam.application.port.in.ChangeStaffPasswordUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.request.ChangePasswordRequest;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for the currently authenticated admin (e.g. change own password).
 * Secured for ADMIN and SUPER_ADMIN.
 */
@RestController
@RequestMapping("/api/admin/me")
public class AdminMeController {

    private final ChangeStaffPasswordUseCase changeStaffPasswordUseCase;

    public AdminMeController(ChangeStaffPasswordUseCase changeStaffPasswordUseCase) {
        this.changeStaffPasswordUseCase = changeStaffPasswordUseCase;
    }

    @PostMapping("/password")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @Valid @RequestBody ChangePasswordRequest request) {
        ChangeStaffPasswordCommand command = new ChangeStaffPasswordCommand(
                identity.getUserId(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        changeStaffPasswordUseCase.changePassword(command);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
