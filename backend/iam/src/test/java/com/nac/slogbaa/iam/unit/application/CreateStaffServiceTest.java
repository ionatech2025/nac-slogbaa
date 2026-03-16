package com.nac.slogbaa.iam.unit.application;

import com.nac.slogbaa.iam.application.dto.command.CreateStaffCommand;
import com.nac.slogbaa.iam.application.dto.result.CreateStaffResult;
import com.nac.slogbaa.iam.application.port.out.*;
import com.nac.slogbaa.iam.application.service.CreateStaffService;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.exception.DuplicateEmailException;
import com.nac.slogbaa.iam.core.exception.StaffRoleLimitReachedException;
import com.nac.slogbaa.iam.core.valueobject.*;
import com.nac.slogbaa.shared.ports.StaffNotificationPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class CreateStaffServiceTest {

    private InMemoryStaffRepo staffRepo;
    private StubTraineeRepo traineeRepo;
    private RecordingNotification notification;
    private CreateStaffService service;

    @BeforeEach
    void setUp() {
        staffRepo = new InMemoryStaffRepo();
        traineeRepo = new StubTraineeRepo();
        notification = new RecordingNotification();
        PasswordHasherPort hasher = new PasswordHasherPort() {
            @Override public String hash(String raw) { return "hashed:" + raw; }
            @Override public boolean matches(String raw, String hashed) { return hashed.equals("hashed:" + raw); }
        };
        service = new CreateStaffService(staffRepo, traineeRepo, hasher, notification);
    }

    @Test
    void createStaffSucceeds() {
        CreateStaffResult result = service.create(
                new CreateStaffCommand("John Admin", "admin@test.com", "ADMIN", "password123"));
        assertNotNull(result.getStaffId());
        assertEquals("admin@test.com", result.getEmail());
        assertEquals("ADMIN", result.getRole());
        assertEquals(1, staffRepo.saved.size());
        assertEquals(1, notification.sentTo.size());
    }

    @Test
    void duplicateStaffEmailRejected() {
        service.create(new CreateStaffCommand("First", "dup@test.com", "ADMIN", "pass123"));
        assertThrows(DuplicateEmailException.class, () ->
                service.create(new CreateStaffCommand("Second", "dup@test.com", "ADMIN", "pass123")));
    }

    @Test
    void traineeEmailRejectedForStaff() {
        traineeRepo.traineeEmail = "taken@test.com";
        assertThrows(DuplicateEmailException.class, () ->
                service.create(new CreateStaffCommand("Staff", "taken@test.com", "ADMIN", "pass123")));
    }

    @Test
    void superAdminLimitEnforced() {
        staffRepo.superAdminCount = 3;
        assertThrows(StaffRoleLimitReachedException.class, () ->
                service.create(new CreateStaffCommand("SA", "sa@test.com", "SUPER_ADMIN", "pass123")));
    }

    @Test
    void adminLimitEnforced() {
        staffRepo.adminCount = 5;
        assertThrows(StaffRoleLimitReachedException.class, () ->
                service.create(new CreateStaffCommand("Admin", "a@test.com", "ADMIN", "pass123")));
    }

    @Test
    void welcomeEmailSentOnSuccess() {
        service.create(new CreateStaffCommand("Test User", "test@test.com", "ADMIN", "password"));
        assertEquals("test@test.com", notification.sentTo.get(0));
    }

    // --- Stubs ---

    private static class InMemoryStaffRepo implements StaffUserRepositoryPort {
        final List<StaffUser> saved = new ArrayList<>();
        long superAdminCount = 0;
        long adminCount = 0;

        @Override public Optional<StaffUser> findByEmail(Email email) {
            return saved.stream().filter(s -> s.getEmail().equals(email)).findFirst();
        }
        @Override public void save(StaffUser user) { saved.add(user); }
        @Override public Optional<StaffUser> findById(StaffUserId id) { return Optional.empty(); }
        @Override public List<StaffUser> findAll() { return saved; }
        @Override public void deleteById(StaffUserId id) {}
        @Override public long count() { return saved.size(); }
        @Override public long countByRole(StaffRole role) {
            return role == StaffRole.SUPER_ADMIN ? superAdminCount : adminCount;
        }
        @Override public void updatePasswordHash(StaffUserId id, String hash) {}
    }

    private static class StubTraineeRepo implements TraineeRepositoryPort {
        String traineeEmail;
        @Override public Optional<Trainee> findByEmail(Email email) {
            if (traineeEmail != null && email.getValue().equals(traineeEmail)) {
                // Return a real Trainee to simulate existence
                return Optional.of(new Trainee(
                    new TraineeId(UUID.randomUUID()), email, "hash",
                    new com.nac.slogbaa.iam.core.entity.Profile(
                        new FullName("A", "B"), Gender.MALE, new District("D"), "R",
                        TraineeCategory.LEADER, new PhysicalAddress("S", "C", "Z"), null),
                    true, java.time.Instant.now(), false));
            }
            return Optional.empty();
        }
        @Override public Trainee save(Trainee t) { return t; }
        @Override public Optional<Trainee> findById(UUID id) { return Optional.empty(); }
        @Override public List<Trainee> findAll() { return List.of(); }
        @Override public void deleteById(UUID id) {}
        @Override public long count() { return 0; }
        @Override public void updatePasswordHash(UUID id, String hash) {}
    }

    private static class RecordingNotification implements StaffNotificationPort {
        final List<String> sentTo = new ArrayList<>();
        @Override public void sendStaffWelcomeEmail(String toEmail, String fullName, String initialPassword) { sentTo.add(toEmail); }
        @Override public void sendPasswordChangedByAdmin(String toEmail, String fullName, String newPassword) {}
    }
}
