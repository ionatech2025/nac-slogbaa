package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.SetStaffPasswordByAdminUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.exception.StaffNotFoundException;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;
import com.nac.slogbaa.shared.ports.StaffNotificationPort;

import java.util.UUID;

/**
 * Application service: SuperAdmin sets a new password for a staff user.
 * Notifies the staff member by email with their new credentials.
 */
public final class SetStaffPasswordByAdminService implements SetStaffPasswordByAdminUseCase {

    private final StaffUserRepositoryPort staffUserRepository;
    private final PasswordHasherPort passwordHasher;
    private final StaffNotificationPort staffNotificationPort;

    public SetStaffPasswordByAdminService(StaffUserRepositoryPort staffUserRepository,
                                         PasswordHasherPort passwordHasher,
                                         StaffNotificationPort staffNotificationPort) {
        this.staffUserRepository = staffUserRepository;
        this.passwordHasher = passwordHasher;
        this.staffNotificationPort = staffNotificationPort;
    }

    @Override
    public void setPassword(UUID staffId, String newPassword) {
        StaffUserId id = StaffUserId.of(staffId);
        StaffUser staff = staffUserRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException("Staff not found: " + staffId));
        String newHash = passwordHasher.hash(newPassword);
        staffUserRepository.updatePasswordHash(id, newHash);
        staffNotificationPort.sendPasswordChangedByAdmin(
                staff.getEmail().getValue(),
                staff.getFullName(),
                newPassword
        );
    }
}
