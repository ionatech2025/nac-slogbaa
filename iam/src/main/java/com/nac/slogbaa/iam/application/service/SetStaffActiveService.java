package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.SetStaffActiveUseCase;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.exception.StaffNotFoundException;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;

import java.util.UUID;

/**
 * Application service: SuperAdmin sets staff active/inactive.
 */
public final class SetStaffActiveService implements SetStaffActiveUseCase {

    private final StaffUserRepositoryPort staffUserRepository;

    public SetStaffActiveService(StaffUserRepositoryPort staffUserRepository) {
        this.staffUserRepository = staffUserRepository;
    }

    @Override
    public void setActive(UUID staffId, boolean active) {
        StaffUserId id = StaffUserId.of(staffId);
        StaffUser user = staffUserRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException("Staff not found: " + staffId));
        StaffUser updated = new StaffUser(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getFullName(),
                user.getStaffRole(),
                active
        );
        staffUserRepository.save(updated);
    }
}
