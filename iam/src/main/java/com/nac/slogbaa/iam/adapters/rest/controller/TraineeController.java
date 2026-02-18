package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.command.UpdateProfileCommand;
import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.UpdateTraineeProfileUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.request.UpdateProfileRequest;
import com.nac.slogbaa.iam.adapters.rest.dto.response.TraineeProfileResponse;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for trainee self-service (profile, etc.). TRAINEE role only.
 */
@RestController
@RequestMapping("/api/trainee")
public class TraineeController {

    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final UpdateTraineeProfileUseCase updateTraineeProfileUseCase;

    public TraineeController(GetTraineeByIdUseCase getTraineeByIdUseCase,
                             UpdateTraineeProfileUseCase updateTraineeProfileUseCase) {
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.updateTraineeProfileUseCase = updateTraineeProfileUseCase;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<TraineeProfileResponse> getMyProfile(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        return getTraineeByIdUseCase.getById(identity.getUserId())
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/me")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> updateMyProfile(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @Valid @RequestBody UpdateProfileRequest request) {
        UpdateProfileCommand command = new UpdateProfileCommand(
                request.getFirstName(),
                request.getLastName(),
                request.getGender(),
                request.getDistrictName(),
                request.getRegion(),
                request.getCategory(),
                request.getStreet(),
                request.getCity(),
                request.getPostalCode(),
                request.getPhoneCountryCode(),
                request.getPhoneNationalNumber()
        );
        updateTraineeProfileUseCase.update(identity.getUserId(), command);
        return ResponseEntity.noContent().build();
    }

    private TraineeProfileResponse toResponse(TraineeDetails d) {
        return new TraineeProfileResponse(
                d.getId().toString(),
                d.getEmail(),
                d.getFirstName(),
                d.getLastName(),
                d.getGender(),
                d.getDistrictName(),
                d.getRegion(),
                d.getCategory(),
                d.getStreet(),
                d.getCity(),
                d.getPostalCode(),
                d.getPhoneCountryCode(),
                d.getPhoneNationalNumber(),
                d.getProfileImageUrl()
        );
    }
}
