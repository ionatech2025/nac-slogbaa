package com.nac.slogbaa.iam.unit.application;

import com.nac.slogbaa.iam.application.dto.command.ChangeTraineePasswordCommand;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.application.service.ChangeTraineePasswordService;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.exception.InvalidCurrentPasswordException;
import com.nac.slogbaa.iam.core.valueobject.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ChangeTraineePasswordServiceTest {

//    private StubTraineeRepo traineeRepo;
//    private ChangeTraineePasswordService service;
//    private UUID traineeId;
//
//    @BeforeEach
//    void setUp() {
//        traineeRepo = new StubTraineeRepo();
//        traineeId = UUID.randomUUID();
//        traineeRepo.add(traineeId, "hashed:current-pw");
//        PasswordHasherPort hasher = new PasswordHasherPort() {
//            @Override
//            public String hash(String raw) {
//                return "hashed:" + raw;
//            }
//
//            @Override
//            public boolean matches(String raw, String hashed) {
//                return hashed.equals("hashed:" + raw);
//            }
//        };
//        service = new ChangeTraineePasswordService(traineeRepo, hasher);
//    }
//
//    @Test
//    void changePasswordSucceeds() {
//        service.changePassword(new ChangeTraineePasswordCommand(traineeId, "current-pw", "new-password"));
//        assertEquals("hashed:new-password", traineeRepo.updatedHash);
//    }
//
//    @Test
//    void wrongCurrentPasswordThrows() {
//        assertThrows(InvalidCurrentPasswordException.class,
//                () -> service.changePassword(new ChangeTraineePasswordCommand(traineeId, "wrong-pw", "new-password")));
//    }
//
//    @Test
//    void nonExistentTraineeThrows() {
//        assertThrows(InvalidCurrentPasswordException.class,
//                () -> service.changePassword(new ChangeTraineePasswordCommand(UUID.randomUUID(), "pw", "new")));
//    }
//
//    // --- Stub ---
//
//    private static class StubTraineeRepo implements TraineeRepositoryPort {
//        final Map<UUID, Trainee> store = new HashMap<>();
//        String updatedHash;
//
//        void add(UUID id, String passwordHash) {
//            store.put(id, new Trainee(new TraineeId(id), new Email("trainee@test.com"),
//                    passwordHash, new Profile(new ProfileId(id), "Trainee User"), false, Instant.now(), 
//                    false));
//        }
//
//        @Override
//        public long count() {
//            return store.size();
//        }
//
//        // @Override
//        // public void updateProfileImage(TraineeId id, String url) {
//        // }
//    }
}
