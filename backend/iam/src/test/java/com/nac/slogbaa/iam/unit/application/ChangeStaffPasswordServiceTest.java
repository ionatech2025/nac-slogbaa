package com.nac.slogbaa.iam.unit.application;

import com.nac.slogbaa.iam.application.dto.command.ChangeStaffPasswordCommand;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.service.ChangeStaffPasswordService;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.exception.InvalidCurrentPasswordException;
import com.nac.slogbaa.iam.core.valueobject.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ChangeStaffPasswordServiceTest {

    private StubStaffRepo staffRepo;
    private ChangeStaffPasswordService service;
    private UUID staffId;

    @BeforeEach
    void setUp() {
        staffRepo = new StubStaffRepo();
        staffId = UUID.randomUUID();
        staffRepo.add(staffId, "hashed:current-pw");
        PasswordHasherPort hasher = new PasswordHasherPort() {
            @Override public String hash(String raw) { return "hashed:" + raw; }
            @Override public boolean matches(String raw, String hashed) { return hashed.equals("hashed:" + raw); }
        };
        service = new ChangeStaffPasswordService(staffRepo, hasher);
    }

    @Test
    void changePasswordSucceeds() {
        service.changePassword(new ChangeStaffPasswordCommand(staffId, "current-pw", "new-password"));
        assertEquals("hashed:new-password", staffRepo.updatedHash);
    }

    @Test
    void wrongCurrentPasswordThrows() {
        assertThrows(InvalidCurrentPasswordException.class, () ->
                service.changePassword(new ChangeStaffPasswordCommand(staffId, "wrong-pw", "new-password")));
    }

    @Test
    void nonExistentStaffThrows() {
        assertThrows(InvalidCurrentPasswordException.class, () ->
                service.changePassword(new ChangeStaffPasswordCommand(UUID.randomUUID(), "pw", "new")));
    }

    // --- Stub ---

    private static class StubStaffRepo implements StaffUserRepositoryPort {
        final Map<UUID, StaffUser> store = new HashMap<>();
        String updatedHash;

        void add(UUID id, String passwordHash) {
            store.put(id, new StaffUser(new StaffUserId(id), new Email("staff@test.com"),
                    passwordHash, "Staff User", StaffRole.ADMIN, true));
        }

        @Override public Optional<StaffUser> findById(StaffUserId id) {
            return Optional.ofNullable(store.get(id.getValue()));
        }
        @Override public void updatePasswordHash(StaffUserId id, String hash) { updatedHash = hash; }
        @Override public Optional<StaffUser> findByEmail(Email email) { return Optional.empty(); }
        @Override public void save(StaffUser user) {}
        @Override public List<StaffUser> findAll() { return List.of(); }
        @Override public void deleteById(StaffUserId id) {}
        @Override public long count() { return store.size(); }
        @Override public long countByRole(StaffRole role) { return 0; }
        @Override public List<StaffUser> findAllByRole(StaffRole role) { return List.of(); }
    }
}
