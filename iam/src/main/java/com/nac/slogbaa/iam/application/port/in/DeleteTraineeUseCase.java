package com.nac.slogbaa.iam.application.port.in;

import java.util.UUID;

/**
 * Use case: delete a trainee by id. SUPER_ADMIN only.
 */
public interface DeleteTraineeUseCase {

    void delete(UUID traineeId);
}
