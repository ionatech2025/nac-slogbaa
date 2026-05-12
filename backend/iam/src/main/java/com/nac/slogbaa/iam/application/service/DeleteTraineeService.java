package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.DeleteTraineeUseCase;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.exception.TraineeNotFoundException;

import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import com.nac.slogbaa.shared.events.SystemActivityEvent;

/**
 * Application service: delete a trainee by id.
 */
public final class DeleteTraineeService implements DeleteTraineeUseCase {

    private final TraineeRepositoryPort traineeRepository;
    private final ApplicationEventPublisher eventPublisher;

    public DeleteTraineeService(TraineeRepositoryPort traineeRepository, ApplicationEventPublisher eventPublisher) {
        this.traineeRepository = traineeRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public void delete(UUID traineeId) {
        if (traineeRepository.findById(traineeId).isEmpty()) {
            throw new TraineeNotFoundException(traineeId);
        }
        traineeRepository.deleteById(traineeId);
        
        eventPublisher.publishEvent(new SystemActivityEvent(
                traineeId,
                "TRAINEE",
                "DELETE",
                traineeId.toString(),
                "Account deleted"
        ));
    }
}
