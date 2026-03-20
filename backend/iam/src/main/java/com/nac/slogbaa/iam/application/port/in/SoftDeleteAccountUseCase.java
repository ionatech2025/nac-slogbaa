package com.nac.slogbaa.iam.application.port.in;

import java.util.UUID;

/**
 * Use case: trainee self-service soft-delete of their own account (GDPR).
 */
public interface SoftDeleteAccountUseCase {

    void softDelete(UUID traineeId, String reason);
}
