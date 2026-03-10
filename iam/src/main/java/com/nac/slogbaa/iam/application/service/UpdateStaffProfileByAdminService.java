package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.command.UpdateStaffProfileCommand;
import com.nac.slogbaa.iam.application.port.in.UpdateStaffProfileByAdminUseCase;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.exception.DuplicateEmailException;
import com.nac.slogbaa.iam.core.exception.StaffNotFoundException;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;

import java.util.UUID;

/**
 * Application service: SuperAdmin updates a staff user's profile (fullName, email).
 */
public final class UpdateStaffProfileByAdminService implements UpdateStaffProfileByAdminUseCase {

    private final StaffUserRepositoryPort staffUserRepository;
    private final TraineeRepositoryPort traineeRepository;

    public UpdateStaffProfileByAdminService(StaffUserRepositoryPort staffUserRepository,
                                            TraineeRepositoryPort traineeRepository) {
        this.staffUserRepository = staffUserRepository;
        this.traineeRepository = traineeRepository;
    }

    @Override
    public void update(UUID staffId, UpdateStaffProfileCommand command) {
        StaffUserId id = StaffUserId.of(staffId);
        StaffUser existing = staffUserRepository.findById(id)
                .orElseThrow(() -> new StaffNotFoundException("Staff not found: " + staffId));

        String newFullName = command.getFullName() != null && !command.getFullName().isBlank()
                ? command.getFullName()
                : existing.getFullName();
        String newEmailValue = command.getEmail() != null && !command.getEmail().isBlank()
                ? command.getEmail().trim()
                : existing.getEmail().getValue();

        if (!newEmailValue.equalsIgnoreCase(existing.getEmail().getValue())) {
            Email newEmail = new Email(newEmailValue);
            staffUserRepository.findByEmail(newEmail).ifPresent(other -> {
                if (!other.getId().getValue().equals(staffId)) {
                    throw new DuplicateEmailException(newEmailValue);
                }
            });
            traineeRepository.findByEmail(newEmail).ifPresent(t -> {
                throw new DuplicateEmailException(newEmailValue);
            });
        }

        StaffUser updated = new StaffUser(
                existing.getId(),
                new Email(newEmailValue),
                existing.getPasswordHash(),
                newFullName,
                existing.getStaffRole(),
                existing.isActive()
        );
        staffUserRepository.save(updated);
    }
}
