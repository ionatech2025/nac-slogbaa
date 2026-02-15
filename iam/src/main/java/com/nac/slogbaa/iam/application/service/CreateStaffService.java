package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.command.CreateStaffCommand;
import com.nac.slogbaa.iam.application.dto.result.CreateStaffResult;
import com.nac.slogbaa.iam.application.port.in.CreateStaffUseCase;
import com.nac.slogbaa.iam.application.port.out.EmailNotificationPort;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.exception.DuplicateEmailException;
import com.nac.slogbaa.iam.core.exception.StaffRoleLimitReachedException;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.StaffRole;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;

import java.util.UUID;

/**
 * Application service: create a new staff user. Enforces role limits and sends credentials by email.
 */
public final class CreateStaffService implements CreateStaffUseCase {

    private static final int MAX_SUPER_ADMINS = 3;
    private static final int MAX_ADMINS = 5;

    private final StaffUserRepositoryPort staffUserRepository;
    private final TraineeRepositoryPort traineeRepository;
    private final PasswordHasherPort passwordHasher;
    private final EmailNotificationPort emailNotificationPort;

    public CreateStaffService(StaffUserRepositoryPort staffUserRepository,
                              TraineeRepositoryPort traineeRepository,
                              PasswordHasherPort passwordHasher,
                              EmailNotificationPort emailNotificationPort) {
        this.staffUserRepository = staffUserRepository;
        this.traineeRepository = traineeRepository;
        this.passwordHasher = passwordHasher;
        this.emailNotificationPort = emailNotificationPort;
    }

    @Override
    public CreateStaffResult create(CreateStaffCommand command) {
        Email email = new Email(command.getEmail());
        if (staffUserRepository.findByEmail(email).isPresent()) {
            throw new DuplicateEmailException(email.getValue());
        }
        if (traineeRepository.findByEmail(email).isPresent()) {
            throw new DuplicateEmailException(email.getValue());
        }

        StaffRole role = StaffRole.valueOf(command.getRole().toUpperCase());
        long currentCount = staffUserRepository.countByRole(role);
        if (role == StaffRole.SUPER_ADMIN && currentCount >= MAX_SUPER_ADMINS) {
            throw new StaffRoleLimitReachedException(
                    "Maximum number of Super Admins (" + MAX_SUPER_ADMINS + ") reached.");
        }
        if (role == StaffRole.ADMIN && currentCount >= MAX_ADMINS) {
            throw new StaffRoleLimitReachedException(
                    "Maximum number of Admins (" + MAX_ADMINS + ") reached.");
        }

        UUID id = UUID.randomUUID();
        String passwordHash = passwordHasher.hash(command.getInitialPassword());
        StaffUser staffUser = new StaffUser(
                new StaffUserId(id),
                email,
                passwordHash,
                command.getFullName().trim(),
                role,
                true
        );
        staffUserRepository.save(staffUser);

        emailNotificationPort.sendStaffCredentials(
                email.getValue(),
                command.getFullName().trim(),
                command.getInitialPassword()
        );

        return new CreateStaffResult(id, email.getValue(), command.getFullName().trim(), role.name());
    }
}
