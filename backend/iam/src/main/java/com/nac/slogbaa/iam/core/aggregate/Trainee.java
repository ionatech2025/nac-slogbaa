package com.nac.slogbaa.iam.core.aggregate;

import com.nac.slogbaa.iam.core.entity.Profile;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.TraineeId;

import java.time.Instant;
import java.util.Objects;

/**
 * Trainee aggregate. No framework dependency.
 */
public final class Trainee {
    private final TraineeId id;
    private final Email email;
    private final String passwordHash;
    private final Profile profile;
    private final boolean isActive;
    private final Instant registrationDate;
    private final boolean emailVerified;

    public Trainee(TraineeId id, Email email, String passwordHash, Profile profile,
                   boolean isActive, Instant registrationDate, boolean emailVerified) {
        this.id = Objects.requireNonNull(id);
        this.email = Objects.requireNonNull(email);
        this.passwordHash = Objects.requireNonNull(passwordHash);
        this.profile = Objects.requireNonNull(profile);
        this.isActive = isActive;
        this.registrationDate = registrationDate != null ? registrationDate : Instant.now();
        this.emailVerified = emailVerified;
    }

    public TraineeId getId() {
        return id;
    }

    public Email getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Profile getProfile() {
        return profile;
    }

    public boolean isActive() {
        return isActive;
    }

    public Instant getRegistrationDate() {
        return registrationDate;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }
}
