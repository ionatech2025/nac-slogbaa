package com.nac.slogbaa.iam.unit.application;

import com.nac.slogbaa.iam.application.port.out.*;
import com.nac.slogbaa.iam.application.service.PasswordResetService;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.entity.PasswordResetToken;
import com.nac.slogbaa.iam.core.exception.InvalidResetTokenException;
import com.nac.slogbaa.iam.core.valueobject.*;
import com.nac.slogbaa.iam.core.entity.Profile;
import com.nac.slogbaa.shared.ports.PasswordResetNotificationPort;
import com.nac.slogbaa.shared.util.FrontendAppBaseUrl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class PasswordResetServiceTest {

    private InMemoryTokenRepo tokenRepo;
    private StubTraineeRepo traineeRepo;
    private StubStaffRepo staffRepo;
    private RecordingNotification notification;
    private PasswordResetService service;

    @BeforeEach
    void setUp() {
        tokenRepo = new InMemoryTokenRepo();
        traineeRepo = new StubTraineeRepo();
        staffRepo = new StubStaffRepo();
        notification = new RecordingNotification();
        PasswordHasherPort hasher = new PasswordHasherPort() {
            @Override public String hash(String raw) { return "hashed:" + raw; }
            @Override public boolean matches(String raw, String hashed) { return hashed.equals("hashed:" + raw); }
        };
        service = new PasswordResetService(traineeRepo, staffRepo, tokenRepo, hasher, notification, "http://localhost:5173");
    }

    @Test
    void initiateResetCreatesTokenAndSendsEmail() {
        traineeRepo.traineeEmail = "user@test.com";
        service.initiateReset("user@test.com");

        assertEquals(1, tokenRepo.saved.size());
        assertEquals(1, notification.sentEmails.size());
        assertEquals("user@test.com", notification.sentEmails.get(0));
    }

    @Test
    void initiateResetSilentForUnknownEmail() {
        service.initiateReset("unknown@test.com");
        assertTrue(tokenRepo.saved.isEmpty());
        assertTrue(notification.sentEmails.isEmpty());
    }

    @Test
    void initiateResetSilentForNullEmail() {
        service.initiateReset(null);
        assertTrue(tokenRepo.saved.isEmpty());
    }

    @Test
    void initiateResetUsesHttpsBaseWhenCommaSeparated() {
        service = new PasswordResetService(traineeRepo, staffRepo, tokenRepo,
                new PasswordHasherPort() {
                    @Override public String hash(String raw) { return "h"; }
                    @Override public boolean matches(String raw, String hashed) { return false; }
                },
                notification,
                FrontendAppBaseUrl.normalize(
                        "http://localhost:5173,http://localhost:3000,https://nac-slogbaa.vercel.app",
                        true));
        traineeRepo.traineeEmail = "user@test.com";
        service.initiateReset("user@test.com");
        assertNotNull(notification.lastResetUrl);
        assertTrue(notification.lastResetUrl.startsWith("https://nac-slogbaa.vercel.app/reset-password?token="),
                () -> "got: " + notification.lastResetUrl);
    }

    @Test
    void validateTokenReturnsTrueForValid() {
        traineeRepo.traineeEmail = "user@test.com";
        tokenRepo.saved.add(new PasswordResetToken("valid-tok", "user@test.com", Instant.now().plusSeconds(600)));
        assertTrue(service.validateResetToken("valid-tok"));
    }

    @Test
    void validateTokenReturnsFalseForExpired() {
        traineeRepo.traineeEmail = "user@test.com";
        tokenRepo.saved.add(new PasswordResetToken("expired", "user@test.com", Instant.now().minusSeconds(60)));
        assertFalse(service.validateResetToken("expired"));
    }

    @Test
    void validateTokenReturnsFalseForUnknown() {
        assertFalse(service.validateResetToken("no-such-token"));
    }

    @Test
    void completeResetUpdatesPasswordAndDeletesToken() {
        traineeRepo.traineeEmail = "user@test.com";
        traineeRepo.traineeId = UUID.randomUUID();
        tokenRepo.saved.add(new PasswordResetToken("tok", "user@test.com", Instant.now().plusSeconds(600)));

        service.completeReset("tok", "newPassword12ch");

        assertTrue(traineeRepo.passwordUpdated);
        assertTrue(tokenRepo.deleted.contains("tok"));
    }

    @Test
    void completeResetRejectsShortPassword() {
        tokenRepo.saved.add(new PasswordResetToken("tok", "user@test.com", Instant.now().plusSeconds(600)));
        assertThrows(IllegalArgumentException.class, () -> service.completeReset("tok", "short"));
    }

    @Test
    void completeResetRejectsExpiredToken() {
        tokenRepo.saved.add(new PasswordResetToken("expired", "user@test.com", Instant.now().minusSeconds(60)));
        assertThrows(InvalidResetTokenException.class, () -> service.completeReset("expired", "newPassword12ch"));
    }

    @Test
    void completeResetRejectsUnknownToken() {
        assertThrows(InvalidResetTokenException.class, () -> service.completeReset("no-such", "newPassword12ch"));
    }

    // --- Stubs ---

    private static class InMemoryTokenRepo implements PasswordResetTokenRepositoryPort {
        final List<PasswordResetToken> saved = new ArrayList<>();
        final List<String> deleted = new ArrayList<>();

        @Override public void save(PasswordResetToken token) { saved.add(token); }
        @Override public Optional<PasswordResetToken> findByToken(String token) {
            return saved.stream().filter(t -> t.getToken().equals(token)).findFirst();
        }
        @Override public void deleteByToken(String token) {
            saved.removeIf(t -> t.getToken().equals(token));
            deleted.add(token);
        }
        @Override public int deleteExpired() {
            Instant now = Instant.now();
            int n = (int) saved.stream().filter(t -> t.getExpiryDate().isBefore(now)).count();
            saved.removeIf(t -> t.getExpiryDate().isBefore(now));
            return n;
        }
    }

    private static class StubTraineeRepo implements TraineeRepositoryPort {
        String traineeEmail;
        UUID traineeId = UUID.randomUUID();
        boolean passwordUpdated = false;

        @Override public Optional<Trainee> findByEmail(Email email) {
            if (traineeEmail != null && email.getValue().equals(traineeEmail)) {
                return Optional.of(new Trainee(new TraineeId(traineeId), email, "hash",
                    new Profile(new FullName("A", "B"), Gender.MALE, new District("D"), "R",
                        TraineeCategory.LEADER, new PhysicalAddress("S", "C", "Z"), null),
                    true, Instant.now(), false));
            }
            return Optional.empty();
        }
        @Override public Trainee save(Trainee t) { return t; }
        @Override public Optional<Trainee> findById(UUID id) { return Optional.empty(); }
        @Override public List<Trainee> findAll() { return List.of(); }
        @Override public void deleteById(UUID id) {}
        @Override public long count() { return 0; }
        @Override public void updatePasswordHash(UUID id, String hash) { passwordUpdated = true; }
        @Override public void setEmailVerified(UUID traineeId, boolean verified) {}
        @Override public void softDelete(UUID traineeId, String reason) {}
        @Override public void updateProfileImage(UUID traineeId, String profileImageUrl) {}
    }

    private static class StubStaffRepo implements StaffUserRepositoryPort {
        @Override public Optional<StaffUser> findByEmail(Email email) { return Optional.empty(); }
        @Override public void save(StaffUser user) {}
        @Override public Optional<StaffUser> findById(StaffUserId id) { return Optional.empty(); }
        @Override public List<StaffUser> findAll() { return List.of(); }
        @Override public void deleteById(StaffUserId id) {}
        @Override public long count() { return 0; }
        @Override public long countByRole(StaffRole role) { return 0; }
        @Override public List<StaffUser> findAllByRole(StaffRole role) { return List.of(); }
        @Override public void updatePasswordHash(StaffUserId id, String hash) {}
    }

    private static class RecordingNotification implements PasswordResetNotificationPort {
        final List<String> sentEmails = new ArrayList<>();
        String lastResetUrl;

        @Override
        public void sendResetLink(String email, String token, String resetUrl) {
            sentEmails.add(email);
            lastResetUrl = resetUrl;
        }
    }
}
