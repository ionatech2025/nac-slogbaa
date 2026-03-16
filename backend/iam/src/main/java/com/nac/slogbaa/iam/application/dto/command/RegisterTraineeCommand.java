package com.nac.slogbaa.iam.application.dto.command;

import java.util.Objects;

/**
 * Command for trainee registration. No framework dependency.
 */
public final class RegisterTraineeCommand {
    private final String email;
    private final String password;
    private final String firstName;
    private final String lastName;
    private final String gender;
    private final String traineeCategory;
    private final String districtName;
    private final String region;
    private final String street;
    private final String city;
    private final String postalCode;
    private final String phoneCountryCode;
    private final String phoneNationalNumber;

    public RegisterTraineeCommand(String email, String password, String firstName, String lastName,
                                  String gender, String traineeCategory, String districtName, String region,
                                  String street, String city, String postalCode,
                                  String phoneCountryCode, String phoneNationalNumber) {
        this.email = Objects.requireNonNull(email);
        this.password = Objects.requireNonNull(password);
        this.firstName = Objects.requireNonNull(firstName);
        this.lastName = Objects.requireNonNull(lastName);
        this.gender = Objects.requireNonNull(gender);
        this.traineeCategory = Objects.requireNonNull(traineeCategory);
        this.districtName = Objects.requireNonNull(districtName);
        this.region = region;
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.phoneCountryCode = phoneCountryCode;
        this.phoneNationalNumber = phoneNationalNumber;
    }

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getGender() { return gender; }
    public String getTraineeCategory() { return traineeCategory; }
    public String getDistrictName() { return districtName; }
    public String getRegion() { return region; }
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getPostalCode() { return postalCode; }
    public String getPhoneCountryCode() { return phoneCountryCode; }
    public String getPhoneNationalNumber() { return phoneNationalNumber; }
}
