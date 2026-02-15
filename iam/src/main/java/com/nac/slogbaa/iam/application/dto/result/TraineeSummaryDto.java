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

    public TraineeSummaryDto(String id, String fullName, String email, String districtName) {
        this.id = Objects.requireNonNull(id);
        this.fullName = Objects.requireNonNull(fullName);
        this.email = Objects.requireNonNull(email);
        this.districtName = Objects.requireNonNull(districtName);
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getDistrictName() { return districtName; }
}
