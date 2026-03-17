package com.nac.slogbaa.iam.unit.application;

import com.nac.slogbaa.iam.application.dto.command.RegisterTraineeCommand;
import com.nac.slogbaa.iam.application.dto.result.RegisterTraineeResult;
import com.nac.slogbaa.iam.application.port.in.VerifyEmailUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.application.service.RegisterTraineeService;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.exception.DuplicateEmailException;
import com.nac.slogbaa.iam.core.exception.StaffCannotSelfRegisterException;
import com.nac.slogbaa.iam.core.valueobject.*;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class RegisterTraineeServiceTest {

    private InMemoryTraineeRepo traineeRepo;
    private StubStaffRepo staffRepo;
    private RecordingNotification notification;
    private NoOpVerifyEmail verifyEmail;
    private RegisterTraineeService service;

    @BeforeEach
    void setUp() {
        traineeRepo = new InMemoryTraineeRepo();
        staffRepo = new StubStaffRepo();
        notification = new RecordingNotification();
        verifyEmail = new NoOpVerifyEmail();
        PasswordHasherPort hasher = new PasswordHasherPort() {
            @Override public String hash(String raw) { return "hashed:" + raw; }
            @Override public boolean matches(String raw, String hashed) { return hashed.equals("hashed:" + raw); }
        };
        service = new RegisterTraineeService(traineeRepo, staffRepo, hasher, notification, verifyEmail);
    }

    @Test
    void registerSucceeds() {
        RegisterTraineeCommand cmd = buildCommand("new@example.com");
        RegisterTraineeResult result = service.register(cmd);

        assertNotNull(result.getTraineeId());
        assertEquals("new@example.com", result.getEmail());
        assertEquals(1, traineeRepo.saved.size());
        assertTrue(notification.sentTo.contains("new@example.com"));
    }

    @Test
    void duplicateEmailThrows() {
        RegisterTraineeCommand cmd = buildCommand("dup@example.com");
        service.register(cmd);

        assertThrows(DuplicateEmailException.class, () -> service.register(cmd));
    }

    @Test
    void staffEmailCannotSelfRegister() {
        staffRepo.staffEmail = "staff@example.com";
        RegisterTraineeCommand cmd = buildCommand("staff@example.com");

        assertThrows(StaffCannotSelfRegisterException.class, () -> service.register(cmd));
    }

    private RegisterTraineeCommand buildCommand(String email) {
        return new RegisterTraineeCommand(
                email, "Password1!", "John", "Doe",
                "male", "leader", "District",
                "Region", "Street", "City", "12345", "+1", "5551234567"
        );
    }

    private static class InMemoryTraineeRepo implements TraineeRepositoryPort {
        final List<Trainee> saved = new ArrayList<>();

        @Override public Trainee save(Trainee t) { saved.add(t); return t; }
        @Override public Optional<Trainee> findByEmail(Email email) {
            return saved.stream().filter(t -> t.getEmail().equals(email)).findFirst();
        }
        @Override public Optional<Trainee> findById(UUID id) { return Optional.empty(); }
        @Override public List<Trainee> findAll() { return saved; }
        @Override public void deleteById(UUID id) {}
        @Override public long count() { return saved.size(); }
        @Override public void updatePasswordHash(UUID traineeId, String newPasswordHash) {}
        @Override public void setEmailVerified(UUID traineeId, boolean verified) {}
        @Override public void softDelete(UUID traineeId, String reason) {}
        @Override public void updateProfileImage(UUID traineeId, String profileImageUrl) {}
    }

    private static class StubStaffRepo implements StaffUserRepositoryPort {
        String staffEmail;

        @Override public Optional<StaffUser> findByEmail(Email email) {
            if (staffEmail != null && email.getValue().equals(staffEmail)) {
                return Optional.of(new StaffUser(
                        new StaffUserId(UUID.randomUUID()),
                        email, "hashed", "Staff User",
                        StaffRole.ADMIN, true
                ));
            }
            return Optional.empty();
        }
        @Override public void save(StaffUser user) {}
        @Override public Optional<StaffUser> findById(StaffUserId id) { return Optional.empty(); }
        @Override public List<StaffUser> findAll() { return List.of(); }
        @Override public void deleteById(StaffUserId id) {}
        @Override public long count() { return 0; }
        @Override public long countByRole(StaffRole role) { return 0; }
        @Override public void updatePasswordHash(StaffUserId id, String newPasswordHash) {}
    }

    private static class RecordingNotification implements TraineeNotificationPort {
        final List<String> sentTo = new ArrayList<>();

        @Override
        public void sendTraineeWelcomeEmail(String email, String fullName) {
            sentTo.add(email);
        }

        @Override
        public void sendCertificateEmail(String toEmail, String traineeName, String courseTitle, byte[] pdfBytes) {}

        @Override
        public void sendPasswordChangedByAdmin(String toEmail, String fullName, String newPassword) {}
    }

    private static class NoOpVerifyEmail implements VerifyEmailUseCase {
        @Override public void sendVerificationEmail(String email) {}
        @Override public boolean verify(String token) { return false; }
        @Override public void resendVerification(String email) {}
    }
}
