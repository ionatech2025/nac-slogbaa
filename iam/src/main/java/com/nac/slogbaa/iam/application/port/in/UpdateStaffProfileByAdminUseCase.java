package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.command.UpdateStaffProfileCommand;

import java.util.UUID;

/**
 * Use case: SuperAdmin updates a staff user's profile (fullName, email).
 */
public interface UpdateStaffProfileByAdminUseCase {

    void update(UUID staffId, UpdateStaffProfileCommand command);
}
