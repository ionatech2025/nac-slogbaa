package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.SoftDeleteAccountUseCase;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.exception.TraineeNotFoundException;

import java.util.UUID;

/**
 * Application service: soft-delete a trainee account (GDPR right to erasure).
 * Sets is_active=false, deleted_at=now(), and records the optional reason.
 */
public final class SoftDeleteAccountService implements SoftDeleteAccountUseCase {

    private final TraineeRepositoryPort traineeRepository;

    public SoftDeleteAccountService(TraineeRepositoryPort traineeRepository) {
        this.traineeRepository = traineeRepository;
    }

    @Override
    public void softDelete(UUID traineeId, String reason) {
        if (traineeRepository.findById(traineeId).isEmpty()) {
            throw new TraineeNotFoundException(traineeId);
        }
        traineeRepository.softDelete(traineeId, reason);
    }
}
