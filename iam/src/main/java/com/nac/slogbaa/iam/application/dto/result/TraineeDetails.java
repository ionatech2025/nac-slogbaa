package com.nac.slogbaa.iam.application.dto.result;

import java.util.Objects;
import java.util.UUID;

/**
 * Full trainee profile details for view/edit. No framework dependency.
 */
public final class TraineeDetails {
    private final UUID id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String gender;
    private final String districtName;
    private final String region;
    private final String category;
    private final String street;
    private final String city;
    private final String postalCode;
    private final String profileImageUrl;

    public TraineeDetails(UUID id, String email, String firstName, String lastName,
                          String gender, String districtName, String region, String category,
                          String street, String city, String postalCode, String profileImageUrl) {
        this.id = Objects.requireNonNull(id);
        this.email = Objects.requireNonNull(email);
        this.firstName = Objects.requireNonNull(firstName);
        this.lastName = Objects.requireNonNull(lastName);
        this.gender = Objects.requireNonNull(gender);
        this.districtName = Objects.requireNonNull(districtName);
        this.region = region;
        this.category = Objects.requireNonNull(category);
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.profileImageUrl = profileImageUrl;
    }

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getGender() { return gender; }
    public String getDistrictName() { return districtName; }
    public String getRegion() { return region; }
    public String getCategory() { return category; }
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getPostalCode() { return postalCode; }
    public String getProfileImageUrl() { return profileImageUrl; }
}
