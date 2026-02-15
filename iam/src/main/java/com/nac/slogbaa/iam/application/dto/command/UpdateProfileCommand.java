package com.nac.slogbaa.iam.application.dto.command;

import java.util.Objects;

/**
 * Command to update a trainee's profile (name, location, address, etc.). No email or password.
 */
public final class UpdateProfileCommand {
    private final String firstName;
    private final String lastName;
    private final String gender;
    private final String districtName;
    private final String region;
    private final String category;
    private final String street;
    private final String city;
    private final String postalCode;

    public UpdateProfileCommand(String firstName, String lastName, String gender,
                                 String districtName, String region, String category,
                                 String street, String city, String postalCode) {
        this.firstName = Objects.requireNonNull(firstName, "firstName must not be null");
        this.lastName = Objects.requireNonNull(lastName, "lastName must not be null");
        this.gender = Objects.requireNonNull(gender, "gender must not be null");
        this.districtName = Objects.requireNonNull(districtName, "districtName must not be null");
        this.region = region != null ? region.trim() : null;
        this.category = Objects.requireNonNull(category, "category must not be null");
        this.street = street != null ? street.trim() : null;
        this.city = city != null ? city.trim() : null;
        this.postalCode = postalCode != null ? postalCode.trim() : null;
    }

    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getGender() { return gender; }
    public String getDistrictName() { return districtName; }
    public String getRegion() { return region; }
    public String getCategory() { return category; }
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getPostalCode() { return postalCode; }
}
