package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;

import java.util.Optional;
import java.util.UUID;

/**
 * Use case: get staff user details by id (for admin user management).
 */
public interface GetStaffByIdUseCase {

    Optional<StaffDetailsDto> getById(UUID staffId);
}
