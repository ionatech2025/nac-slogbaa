package com.nac.slogbaa.iam.application.port.in;

import java.util.UUID;

/**
 * Use case: SuperAdmin sets a new password for a trainee (no current password required).
 */
public interface SetTraineePasswordByAdminUseCase {

    void setPassword(UUID traineeId, String newPassword);
}
