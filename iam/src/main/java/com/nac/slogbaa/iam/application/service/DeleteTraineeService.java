package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.DeleteTraineeUseCase;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.exception.TraineeNotFoundException;

import java.util.UUID;

/**
 * Application service: delete a trainee by id.
 */
public final class DeleteTraineeService implements DeleteTraineeUseCase {

    private final TraineeRepositoryPort traineeRepository;

    public DeleteTraineeService(TraineeRepositoryPort traineeRepository) {
        this.traineeRepository = traineeRepository;
    }

    @Override
    public void delete(UUID traineeId) {
        if (traineeRepository.findById(traineeId).isEmpty()) {
            throw new TraineeNotFoundException(traineeId);
        }
        traineeRepository.deleteById(traineeId);
    }
}
