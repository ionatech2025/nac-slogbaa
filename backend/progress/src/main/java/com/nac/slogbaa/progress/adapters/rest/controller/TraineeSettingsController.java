package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.port.out.TraineeSettingsPort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for trainee settings (certificate email opt-in).
 */
@RestController
@RequestMapping("/api/me/settings")
@PreAuthorize("hasRole('TRAINEE')")
public class TraineeSettingsController {

    private final TraineeSettingsPort traineeSettingsPort;

    public TraineeSettingsController(TraineeSettingsPort traineeSettingsPort) {
        this.traineeSettingsPort = traineeSettingsPort;
    }

    @GetMapping
    public ResponseEntity<SettingsResponse> get(@AuthenticationPrincipal AuthenticatedIdentity identity) {
        boolean certificateEmailOptIn = traineeSettingsPort.isCertificateEmailOptIn(identity.getUserId());
        return ResponseEntity.ok(new SettingsResponse(certificateEmailOptIn));
    }

    @PutMapping
    public ResponseEntity<SettingsResponse> update(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestBody SettingsRequest request) {
        traineeSettingsPort.setCertificateEmailOptIn(identity.getUserId(), Boolean.TRUE.equals(request.certificateEmailOptIn()));
        return ResponseEntity.ok(new SettingsResponse(traineeSettingsPort.isCertificateEmailOptIn(identity.getUserId())));
    }

    public record SettingsResponse(boolean certificateEmailOptIn) {}
    public record SettingsRequest(Boolean certificateEmailOptIn) {}
}
