package com.nac.slogbaa.iam.application.dto.result;

import java.util.Objects;

/**
 * Summary of a trainee for dashboard listing. No framework dependency.
 */
public final class TraineeSummaryDto {
    private final String id;
    private final String fullName;
    private final String email;
    private final String districtName;
    private final String gender;
    private final String traineeCategory;

    public TraineeSummaryDto(String id, String fullName, String email, String districtName, String gender, String traineeCategory) {
        this.id = Objects.requireNonNull(id);
        this.fullName = Objects.requireNonNull(fullName);
        this.email = Objects.requireNonNull(email);
        this.districtName = Objects.requireNonNull(districtName);
        this.gender = gender;
        this.traineeCategory = traineeCategory;
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getDistrictName() { return districtName; }
    public String getGender() { return gender; }
    public String getTraineeCategory() { return traineeCategory; }
}
