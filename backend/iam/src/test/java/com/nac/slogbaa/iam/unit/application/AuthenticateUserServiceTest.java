package com.nac.slogbaa.iam.unit.application;

import com.nac.slogbaa.iam.application.dto.command.AuthenticationCommand;
import com.nac.slogbaa.iam.application.dto.result.AuthenticationResult;
import com.nac.slogbaa.iam.application.port.out.AuthTokenPort;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.application.service.AuthenticateUserService;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.entity.Profile;
import com.nac.slogbaa.iam.core.exception.EmailNotVerifiedException;
import com.nac.slogbaa.iam.core.exception.InvalidCredentialsException;
import com.nac.slogbaa.iam.core.valueobject.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class AuthenticateUserServiceTest {

    private StubTraineeRepository traineeRepo;
    private StubStaffRepository staffRepo;
    private StubPasswordHasher passwordHasher;
    private StubAuthTokenPort authTokenPort;
    private AuthenticateUserService service;

    @BeforeEach
    void setUp() {
        traineeRepo = new StubTraineeRepository();
        staffRepo = new StubStaffRepository();
        passwordHasher = new StubPasswordHasher();
        authTokenPort = new StubAuthTokenPort();
        service = new AuthenticateUserService(traineeRepo, staffRepo, passwordHasher, authTokenPort, 86400, true);
    }

    @Test
    void authenticateTraineeSuccess() {
        UUID id = UUID.randomUUID();
        Trainee trainee = createTrainee(id, "trainee@test.com", "hashed-pw", true, true);
        traineeRepo.setResult(trainee);
        passwordHasher.setMatches(true);

        AuthenticationResult result = service.authenticate(
                new AuthenticationCommand("trainee@test.com", "password"));

        assertEquals("mock-token", result.getToken());
        assertEquals(id.toString(), result.getUserId());
        assertEquals("trainee@test.com", result.getEmail());
        assertEquals("TRAINEE", result.getRole());
    }

    @Test
    void authenticateInactiveTraineeThrows() {
        Trainee trainee = createTrainee(UUID.randomUUID(), "inactive@test.com", "hashed-pw", false, true);
        traineeRepo.setResult(trainee);

        assertThrows(InvalidCredentialsException.class, () ->
                service.authenticate(new AuthenticationCommand("inactive@test.com", "password")));
    }

    @Test
    void authenticateUnverifiedEmailThrows() {
        Trainee trainee = createTrainee(UUID.randomUUID(), "unverified@test.com", "hashed-pw", true, false);
        traineeRepo.setResult(trainee);
        passwordHasher.setMatches(true);

        assertThrows(EmailNotVerifiedException.class, () ->
                service.authenticate(new AuthenticationCommand("unverified@test.com", "password")));
    }

    @Test
    void authenticateWrongPasswordThrows() {
        Trainee trainee = createTrainee(UUID.randomUUID(), "user@test.com", "hashed-pw", true, true);
        traineeRepo.setResult(trainee);
        passwordHasher.setMatches(false);

        assertThrows(InvalidCredentialsException.class, () ->
                service.authenticate(new AuthenticationCommand("user@test.com", "wrong-pw")));
    }

    @Test
    void authenticateNonExistentEmailThrows() {
        assertThrows(InvalidCredentialsException.class, () ->
                service.authenticate(new AuthenticationCommand("nobody@test.com", "password")));
    }

    private Trainee createTrainee(UUID id, String email, String passwordHash, boolean active, boolean emailVerified) {
        return new Trainee(
                new TraineeId(id),
                new Email(email),
                passwordHash,
                new Profile(
                        new FullName("Test", "User"),
                        Gender.MALE,
                        new District("District"),
                        "Region",
                        TraineeCategory.LEADER,
                        new PhysicalAddress("Street", "City", "12345"),
                        null
                ),
                active,
                Instant.now(),
                emailVerified
        );
    }

    // Stub implementations

    private static class StubTraineeRepository implements TraineeRepositoryPort {
        private Trainee result;

        void setResult(Trainee t) { this.result = t; }

        @Override public Optional<Trainee> findByEmail(Email email) {
            if (result != null && result.getEmail().equals(email)) return Optional.of(result);
            return Optional.empty();
        }
        @Override public Trainee save(Trainee trainee) { return trainee; }
        @Override public Optional<Trainee> findById(UUID id) { return Optional.empty(); }
        @Override public List<Trainee> findAll() { return List.of(); }
        @Override public void deleteById(UUID id) {}
        @Override public long count() { return 0; }
        @Override public void updatePasswordHash(UUID traineeId, String newPasswordHash) {}
        @Override public void setEmailVerified(UUID traineeId, boolean verified) {}
        @Override public void softDelete(UUID traineeId, String reason) {}
        @Override public void updateProfileImage(UUID traineeId, String profileImageUrl) {}
    }

    private static class StubStaffRepository implements StaffUserRepositoryPort {
        @Override public Optional<StaffUser> findByEmail(Email email) { return Optional.empty(); }
        @Override public void save(StaffUser user) {}
        @Override public Optional<StaffUser> findById(StaffUserId id) { return Optional.empty(); }
        @Override public List<StaffUser> findAll() { return List.of(); }
        @Override public void deleteById(StaffUserId id) {}
        @Override public long count() { return 0; }
        @Override public long countByRole(StaffRole role) { return 0; }
        @Override public void updatePasswordHash(StaffUserId id, String newPasswordHash) {}
    }

    private static class StubPasswordHasher implements PasswordHasherPort {
        private boolean matches = true;

        void setMatches(boolean m) { this.matches = m; }

        @Override public String hash(String rawPassword) { return "hashed-" + rawPassword; }
        @Override public boolean matches(String rawPassword, String hashedPassword) { return matches; }
    }

    private static class StubAuthTokenPort implements AuthTokenPort {
        @Override public String generateToken(AuthenticatedIdentity identity, long expirySeconds) { return "mock-token"; }
        @Override public Optional<AuthenticatedIdentity> parseToken(String token) { return Optional.empty(); }
    }
}
