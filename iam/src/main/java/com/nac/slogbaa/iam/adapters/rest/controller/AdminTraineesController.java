package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.DeleteTraineeUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.iam.adapters.rest.dto.response.TraineeProfileResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * REST controller for admin trainee management. View profile: ADMIN and SUPER_ADMIN. Delete: SUPER_ADMIN only.
 */
@RestController
@RequestMapping("/api/admin/trainees")
public class AdminTraineesController {

    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final DeleteTraineeUseCase deleteTraineeUseCase;

    public AdminTraineesController(GetTraineeByIdUseCase getTraineeByIdUseCase,
                                  DeleteTraineeUseCase deleteTraineeUseCase) {
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.deleteTraineeUseCase = deleteTraineeUseCase;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<TraineeProfileResponse> getTraineeProfile(@PathVariable UUID id) {
        return getTraineeByIdUseCase.getById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteTrainee(@PathVariable UUID id) {
        deleteTraineeUseCase.delete(id);
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
                d.getProfileImageUrl()
        );
    }
}
