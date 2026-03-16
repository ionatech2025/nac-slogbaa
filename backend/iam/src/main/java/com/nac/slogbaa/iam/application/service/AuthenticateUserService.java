package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.command.AuthenticationCommand;
import com.nac.slogbaa.iam.application.dto.result.AuthenticationResult;
import com.nac.slogbaa.iam.application.port.in.AuthenticateUserUseCase;
import com.nac.slogbaa.iam.application.port.out.AuthTokenPort;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.exception.InvalidCredentialsException;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedRole;
import com.nac.slogbaa.iam.core.valueobject.Email;

/**
 * Application service: authenticate trainee or staff by email/password.
 * Uses only ports; no framework dependency.
 */
public final class AuthenticateUserService implements AuthenticateUserUseCase {

    private final TraineeRepositoryPort traineeRepository;
    private final StaffUserRepositoryPort staffUserRepository;
    private final PasswordHasherPort passwordHasher;
    private final AuthTokenPort authTokenPort;
    private final long tokenExpirySeconds;

    public AuthenticateUserService(TraineeRepositoryPort traineeRepository,
                                   StaffUserRepositoryPort staffUserRepository,
                                   PasswordHasherPort passwordHasher,
                                   AuthTokenPort authTokenPort,
                                   long tokenExpirySeconds) {
        this.traineeRepository = traineeRepository;
        this.staffUserRepository = staffUserRepository;
        this.passwordHasher = passwordHasher;
        this.authTokenPort = authTokenPort;
        this.tokenExpirySeconds = tokenExpirySeconds > 0 ? tokenExpirySeconds : 86400L;
    }

    @Override
    public AuthenticationResult authenticate(AuthenticationCommand command) {
        Email email = new Email(command.getEmail());
        String rawPassword = command.getPassword();

        // Try staff first, then trainee (or reverse; staff is typically smaller set)
        var staff = staffUserRepository.findByEmail(email);
        if (staff.isPresent()) {
            return authenticateStaff(staff.get(), rawPassword);
        }
        var trainee = traineeRepository.findByEmail(email);
        if (trainee.isPresent()) {
            return authenticateTrainee(trainee.get(), rawPassword);
        }
        throw new InvalidCredentialsException();
    }

    private AuthenticationResult authenticateStaff(StaffUser user, String rawPassword) {
        if (!user.isActive()) {
            throw new InvalidCredentialsException();
        }
        if (!passwordHasher.matches(rawPassword, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        AuthenticatedRole role = user.getStaffRole() == com.nac.slogbaa.iam.core.valueobject.StaffRole.SUPER_ADMIN
                ? AuthenticatedRole.SUPER_ADMIN
                : AuthenticatedRole.ADMIN;
        AuthenticatedIdentity identity = new AuthenticatedIdentity(
                user.getId().getValue(),
                user.getEmail().getValue(),
                role
        );
        String token = authTokenPort.generateToken(identity, tokenExpirySeconds);
        return new AuthenticationResult(
                token,
                user.getId().getValue().toString(),
                user.getEmail().getValue(),
                role.name(),
                user.getFullName()
        );
    }

    private AuthenticationResult authenticateTrainee(Trainee user, String rawPassword) {
        if (!user.isActive()) {
            throw new InvalidCredentialsException();
        }
        if (!passwordHasher.matches(rawPassword, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        AuthenticatedIdentity identity = new AuthenticatedIdentity(
                user.getId().getValue(),
                user.getEmail().getValue(),
                AuthenticatedRole.TRAINEE
        );
        String token = authTokenPort.generateToken(identity, tokenExpirySeconds);
        String fullName = user.getProfile().getFullName().getFirstName() + " "
                + user.getProfile().getFullName().getLastName();
        return new AuthenticationResult(
                token,
                user.getId().getValue().toString(),
                user.getEmail().getValue(),
                AuthenticatedRole.TRAINEE.name(),
                fullName
        );
    }
}
