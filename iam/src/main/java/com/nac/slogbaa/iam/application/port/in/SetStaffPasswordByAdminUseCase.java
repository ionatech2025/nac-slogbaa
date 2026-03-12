package com.nac.slogbaa.iam.application.port.in;

import java.util.UUID;

/**
 * Use case: SuperAdmin sets a new password for a staff user (no current password required).
 */
public interface SetStaffPasswordByAdminUseCase {

    void setPassword(UUID staffId, String newPassword);
}
