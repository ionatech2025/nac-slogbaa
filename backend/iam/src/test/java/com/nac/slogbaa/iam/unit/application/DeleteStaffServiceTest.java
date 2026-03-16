package com.nac.slogbaa.iam.unit.application;

import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.service.DeleteStaffService;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.exception.CannotDeleteLastSuperAdminException;
import com.nac.slogbaa.iam.core.exception.CannotDeleteSelfException;
import com.nac.slogbaa.iam.core.exception.StaffNotFoundException;
import com.nac.slogbaa.iam.core.valueobject.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class DeleteStaffServiceTest {

    private InMemoryStaffRepo staffRepo;
    private DeleteStaffService service;

    @BeforeEach
    void setUp() {
        staffRepo = new InMemoryStaffRepo();
        service = new DeleteStaffService(staffRepo);
    }

    @Test
    void deleteAdminSucceeds() {
        UUID adminId = UUID.randomUUID();
        UUID currentUserId = UUID.randomUUID();
        staffRepo.add(adminId, StaffRole.ADMIN);

        service.delete(adminId, currentUserId);
        assertTrue(staffRepo.deletedIds.contains(StaffUserId.of(adminId)));
    }

    @Test
    void cannotDeleteSelf() {
        UUID id = UUID.randomUUID();
        staffRepo.add(id, StaffRole.ADMIN);
        assertThrows(CannotDeleteSelfException.class, () -> service.delete(id, id));
    }

    @Test
    void cannotDeleteLastSuperAdmin() {
        UUID saId = UUID.randomUUID();
        UUID currentId = UUID.randomUUID();
        staffRepo.add(saId, StaffRole.SUPER_ADMIN);
        staffRepo.superAdminCount = 1;

        assertThrows(CannotDeleteLastSuperAdminException.class, () -> service.delete(saId, currentId));
    }

    @Test
    void canDeleteSuperAdminWhenMultipleExist() {
        UUID saId = UUID.randomUUID();
        UUID currentId = UUID.randomUUID();
        staffRepo.add(saId, StaffRole.SUPER_ADMIN);
        staffRepo.superAdminCount = 2;

        service.delete(saId, currentId);
        assertTrue(staffRepo.deletedIds.contains(StaffUserId.of(saId)));
    }

    @Test
    void deleteNonExistentStaffThrows() {
        UUID unknownId = UUID.randomUUID();
        UUID currentId = UUID.randomUUID();
        assertThrows(StaffNotFoundException.class, () -> service.delete(unknownId, currentId));
    }

    // --- Stub ---

    private static class InMemoryStaffRepo implements StaffUserRepositoryPort {
        final Map<UUID, StaffUser> store = new HashMap<>();
        final List<StaffUserId> deletedIds = new ArrayList<>();
        long superAdminCount = 0;

        void add(UUID id, StaffRole role) {
            store.put(id, new StaffUser(new StaffUserId(id), new Email("staff" + id.toString().substring(0, 4) + "@test.com"),
                    "hash", "Staff User", role, true));
        }

        @Override public Optional<StaffUser> findById(StaffUserId id) {
            return Optional.ofNullable(store.get(id.getValue()));
        }
        @Override public void deleteById(StaffUserId id) { deletedIds.add(id); store.remove(id.getValue()); }
        @Override public long countByRole(StaffRole role) { return superAdminCount; }
        @Override public Optional<StaffUser> findByEmail(Email email) { return Optional.empty(); }
        @Override public void save(StaffUser user) {}
        @Override public List<StaffUser> findAll() { return List.of(); }
        @Override public long count() { return store.size(); }
        @Override public void updatePasswordHash(StaffUserId id, String hash) {}
    }
}
