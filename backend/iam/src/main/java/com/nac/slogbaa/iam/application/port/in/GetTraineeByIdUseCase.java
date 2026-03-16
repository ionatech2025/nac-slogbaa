package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;

import java.util.Optional;
import java.util.UUID;

/**
 * Use case: get full trainee details by id (e.g. for profile view). TRAINEE role for own id only.
 */
public interface GetTraineeByIdUseCase {

    Optional<TraineeDetails> getById(UUID traineeId);
}
