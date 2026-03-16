package com.nac.slogbaa.iam.unit.core;

import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.entity.Profile;
import com.nac.slogbaa.iam.core.valueobject.*;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class TraineeTest {

    @Test
    void traineeIsCreatedWithAllFields() {
        TraineeId id = new TraineeId(UUID.randomUUID());
        Email email = new Email("test@example.com");
        Profile profile = createProfile();

        Trainee trainee = new Trainee(id, email, "hashedpw", profile, true, Instant.now(), false);

        assertEquals(id, trainee.getId());
        assertEquals(email, trainee.getEmail());
        assertEquals("hashedpw", trainee.getPasswordHash());
        assertTrue(trainee.isActive());
        assertFalse(trainee.isEmailVerified());
        assertNotNull(trainee.getRegistrationDate());
    }

    @Test
    void traineeRequiresNonNullId() {
        assertThrows(Throwable.class, () ->
                new Trainee(null, new Email("a@b.com"), "pw", createProfile(), true, Instant.now(), false));
    }

    @Test
    void traineeRequiresNonNullEmail() {
        assertThrows(Throwable.class, () ->
                new Trainee(new TraineeId(UUID.randomUUID()), null, "pw", createProfile(), true, Instant.now(), false));
    }

    @Test
    void traineeDefaultsRegistrationDateToNowIfNull() {
        Trainee trainee = new Trainee(
                new TraineeId(UUID.randomUUID()),
                new Email("test@example.com"),
                "pw",
                createProfile(),
                true,
                null,
                false
        );
        assertNotNull(trainee.getRegistrationDate());
    }

    private Profile createProfile() {
        return new Profile(
                new FullName("John", "Doe"),
                Gender.MALE,
                new District("Test District"),
                "Test Region",
                TraineeCategory.LEADER,
                new PhysicalAddress("Street", "City", "12345"),
                null
        );
    }
}
