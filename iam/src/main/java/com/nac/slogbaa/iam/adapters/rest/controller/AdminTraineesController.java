package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.application.port.in.DeleteTraineeUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * REST controller for admin trainee management. Delete is SUPER_ADMIN only.
 */
@RestController
@RequestMapping("/api/admin/trainees")
public class AdminTraineesController {

    private final DeleteTraineeUseCase deleteTraineeUseCase;

    public AdminTraineesController(DeleteTraineeUseCase deleteTraineeUseCase) {
        this.deleteTraineeUseCase = deleteTraineeUseCase;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteTrainee(@PathVariable UUID id) {
        deleteTraineeUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }
}
