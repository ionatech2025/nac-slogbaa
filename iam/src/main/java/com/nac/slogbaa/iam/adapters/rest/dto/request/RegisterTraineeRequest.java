package com.nac.slogbaa.iam.adapters.rest.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RegisterTraineeRequest {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Trainee category is required")
    private String traineeCategory;

    @NotBlank(message = "District is required")
    private String districtName;

    private String region;
    private String street;
    private String city;
    private String postalCode;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getTraineeCategory() { return traineeCategory; }
    public void setTraineeCategory(String traineeCategory) { this.traineeCategory = traineeCategory; }
    public String getDistrictName() { return districtName; }
    public void setDistrictName(String districtName) { this.districtName = districtName; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
}
