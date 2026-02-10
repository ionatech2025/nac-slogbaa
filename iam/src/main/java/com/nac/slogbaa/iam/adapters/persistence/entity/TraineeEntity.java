package com.nac.slogbaa.iam.adapters.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "trainee", indexes = {
        @Index(name = "idx_trainee_email", columnList = "email"),
        @Index(name = "idx_trainee_active", columnList = "is_active"),
        @Index(name = "idx_trainee_category", columnList = "trainee_category"),
        @Index(name = "idx_trainee_district", columnList = "district_name"),
        @Index(name = "idx_trainee_registration", columnList = "registration_date")
})
public class TraineeEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "street", length = 255)
    private String street;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 20)
    private GenderEnum gender;

    @Column(name = "district_name", nullable = false, length = 100)
    private String districtName;

    @Column(name = "region", length = 100)
    private String region;

    @Enumerated(EnumType.STRING)
    @Column(name = "trainee_category", nullable = false, length = 50)
    private TraineeCategoryEnum traineeCategory;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "registration_date", nullable = false)
    private Instant registrationDate;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum GenderEnum {
        MALE,
        FEMALE
    }

    public enum TraineeCategoryEnum {
        LEADER,
        CIVIL_SOCIETY_MEMBER,
        COMMUNITY_MEMBER
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (registrationDate == null) registrationDate = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public GenderEnum getGender() { return gender; }
    public void setGender(GenderEnum gender) { this.gender = gender; }
    public String getDistrictName() { return districtName; }
    public void setDistrictName(String districtName) { this.districtName = districtName; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public TraineeCategoryEnum getTraineeCategory() { return traineeCategory; }
    public void setTraineeCategory(TraineeCategoryEnum traineeCategory) { this.traineeCategory = traineeCategory; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Instant getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(Instant registrationDate) { this.registrationDate = registrationDate; }
    public Instant getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
