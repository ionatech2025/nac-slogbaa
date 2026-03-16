package com.nac.slogbaa.iam.adapters.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for PATCH /api/trainee/me (update trainee profile).
 */
public class UpdateProfileRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String lastName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "District is required")
    @Size(max = 100)
    private String districtName;

    @Size(max = 100)
    private String region;

    @NotBlank(message = "Category is required")
    private String category;

    @Size(max = 255)
    private String street;

    @Size(max = 100)
    private String city;

    @Size(max = 20)
    private String postalCode;

    @Size(max = 10)
    private String phoneCountryCode;

    @Size(max = 20)
    private String phoneNationalNumber;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getDistrictName() { return districtName; }
    public void setDistrictName(String districtName) { this.districtName = districtName; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public String getPhoneCountryCode() { return phoneCountryCode; }
    public void setPhoneCountryCode(String phoneCountryCode) { this.phoneCountryCode = phoneCountryCode; }
    public String getPhoneNationalNumber() { return phoneNationalNumber; }
    public void setPhoneNationalNumber(String phoneNationalNumber) { this.phoneNationalNumber = phoneNationalNumber; }
}
