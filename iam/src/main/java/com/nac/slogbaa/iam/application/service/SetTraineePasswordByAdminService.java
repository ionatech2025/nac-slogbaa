package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.SetTraineePasswordByAdminUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.exception.TraineeNotFoundException;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;

import java.util.UUID;

/**
 * Application service: SuperAdmin sets a new password for a trainee.
 * Notifies the trainee by email with their new credentials.
 */
public final class SetTraineePasswordByAdminService implements SetTraineePasswordByAdminUseCase {

    private final TraineeRepositoryPort traineeRepository;
    private final PasswordHasherPort passwordHasher;
    private final TraineeNotificationPort traineeNotificationPort;

    public SetTraineePasswordByAdminService(TraineeRepositoryPort traineeRepository,
                                            PasswordHasherPort passwordHasher,
                                            TraineeNotificationPort traineeNotificationPort) {
        this.traineeRepository = traineeRepository;
        this.passwordHasher = passwordHasher;
        this.traineeNotificationPort = traineeNotificationPort;
    }

    @Override
    public void setPassword(UUID traineeId, String newPassword) {
        Trainee trainee = traineeRepository.findById(traineeId)
                .orElseThrow(() -> new TraineeNotFoundException(traineeId));
        String newHash = passwordHasher.hash(newPassword);
        traineeRepository.updatePasswordHash(traineeId, newHash);
        String fullName = trainee.getProfile().getFullName().getFullName();
        traineeNotificationPort.sendPasswordChangedByAdmin(
                trainee.getEmail().getValue(),
                fullName,
                newPassword
        );
    }
}
