package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.SetTraineePasswordByAdminUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.exception.TraineeNotFoundException;

import java.util.UUID;

/**
 * Application service: SuperAdmin sets a new password for a trainee.
 */
public final class SetTraineePasswordByAdminService implements SetTraineePasswordByAdminUseCase {

    private final TraineeRepositoryPort traineeRepository;
    private final PasswordHasherPort passwordHasher;

    public SetTraineePasswordByAdminService(TraineeRepositoryPort traineeRepository,
                                            PasswordHasherPort passwordHasher) {
        this.traineeRepository = traineeRepository;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public void setPassword(UUID traineeId, String newPassword) {
        if (traineeRepository.findById(traineeId).isEmpty()) {
            throw new TraineeNotFoundException(traineeId);
        }
        String newHash = passwordHasher.hash(newPassword);
        traineeRepository.updatePasswordHash(traineeId, newHash);
    }
}
