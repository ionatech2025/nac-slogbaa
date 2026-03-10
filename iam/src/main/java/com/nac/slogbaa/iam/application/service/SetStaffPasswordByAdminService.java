package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.SetStaffPasswordByAdminUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.exception.StaffNotFoundException;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;

import java.util.UUID;

/**
 * Application service: SuperAdmin sets a new password for a staff user.
 */
public final class SetStaffPasswordByAdminService implements SetStaffPasswordByAdminUseCase {

    private final StaffUserRepositoryPort staffUserRepository;
    private final PasswordHasherPort passwordHasher;

    public SetStaffPasswordByAdminService(StaffUserRepositoryPort staffUserRepository,
                                         PasswordHasherPort passwordHasher) {
        this.staffUserRepository = staffUserRepository;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public void setPassword(UUID staffId, String newPassword) {
        StaffUserId id = StaffUserId.of(staffId);
        if (staffUserRepository.findById(id).isEmpty()) {
            throw new StaffNotFoundException("Staff not found: " + staffId);
        }
        String newHash = passwordHasher.hash(newPassword);
        staffUserRepository.updatePasswordHash(id, newHash);
    }
}
