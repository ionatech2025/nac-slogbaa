package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.command.ChangeTraineePasswordCommand;
import com.nac.slogbaa.iam.application.port.in.ChangeTraineePasswordUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.exception.InvalidCurrentPasswordException;

/**
 * Application service: trainee changes their own password.
 * Verifies current password, hashes new one, updates via repository.
 */
public final class ChangeTraineePasswordService implements ChangeTraineePasswordUseCase {

    private final TraineeRepositoryPort traineeRepository;
    private final PasswordHasherPort passwordHasher;

    public ChangeTraineePasswordService(TraineeRepositoryPort traineeRepository,
                                        PasswordHasherPort passwordHasher) {
        this.traineeRepository = traineeRepository;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public void changePassword(ChangeTraineePasswordCommand command) {
        var trainee = traineeRepository.findById(command.getTraineeUserId());
        if (trainee.isEmpty()) {
            throw new InvalidCurrentPasswordException();
        }
        var user = trainee.get();
        if (!passwordHasher.matches(command.getCurrentPassword(), user.getPasswordHash())) {
            throw new InvalidCurrentPasswordException();
        }
        String newHash = passwordHasher.hash(command.getNewPassword());
        traineeRepository.updatePasswordHash(command.getTraineeUserId(), newHash);
    }
}
