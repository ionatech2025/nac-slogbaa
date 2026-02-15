package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.command.ChangeStaffPasswordCommand;
import com.nac.slogbaa.iam.application.port.in.ChangeStaffPasswordUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.exception.InvalidCurrentPasswordException;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;

/**
 * Application service: staff changes their own password.
 * Verifies current password, hashes new one, updates via repository.
 */
public final class ChangeStaffPasswordService implements ChangeStaffPasswordUseCase {

    private final StaffUserRepositoryPort staffUserRepository;
    private final PasswordHasherPort passwordHasher;

    public ChangeStaffPasswordService(StaffUserRepositoryPort staffUserRepository,
                                      PasswordHasherPort passwordHasher) {
        this.staffUserRepository = staffUserRepository;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public void changePassword(ChangeStaffPasswordCommand command) {
        StaffUserId staffUserId = StaffUserId.of(command.getStaffUserId());
        var staff = staffUserRepository.findById(staffUserId);
        if (staff.isEmpty()) {
            throw new InvalidCurrentPasswordException();
        }
        var user = staff.get();
        if (!passwordHasher.matches(command.getCurrentPassword(), user.getPasswordHash())) {
            throw new InvalidCurrentPasswordException();
        }
        String newHash = passwordHasher.hash(command.getNewPassword());
        staffUserRepository.updatePasswordHash(staffUserId, newHash);
    }
}
