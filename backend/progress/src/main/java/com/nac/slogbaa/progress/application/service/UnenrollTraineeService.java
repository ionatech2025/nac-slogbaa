package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.port.in.UnenrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;

import java.util.UUID;

/**
 * Application service: withdraw a trainee from a course.
 * Sets the enrollment status to WITHDRAWN (soft-delete, preserves history).
 * Idempotent: if trainee is not enrolled or already withdrawn, this is a no-op.
 */
public final class UnenrollTraineeService implements UnenrollTraineeUseCase {

    private final TraineeProgressRepositoryPort traineeProgressRepository;

    public UnenrollTraineeService(TraineeProgressRepositoryPort traineeProgressRepository) {
        this.traineeProgressRepository = traineeProgressRepository;
    }

    @Override
    public void unenroll(UUID traineeId, UUID courseId) {
        traineeProgressRepository.updateCompletionStatus(traineeId, courseId, "WITHDRAWN", 0);
    }
}
