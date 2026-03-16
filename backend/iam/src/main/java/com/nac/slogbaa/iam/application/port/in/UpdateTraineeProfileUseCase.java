package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.command.UpdateProfileCommand;

import java.util.UUID;

/**
 * Use case: update a trainee's profile. Caller must ensure traineeId is the current user (TRAINEE only).
 */
public interface UpdateTraineeProfileUseCase {

    void update(UUID traineeId, UpdateProfileCommand command);
}
