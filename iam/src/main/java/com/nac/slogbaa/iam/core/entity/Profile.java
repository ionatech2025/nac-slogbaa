package com.nac.slogbaa.iam.core.entity;

import com.nac.slogbaa.iam.core.valueobject.District;
import com.nac.slogbaa.iam.core.valueobject.FullName;
import com.nac.slogbaa.iam.core.valueobject.Gender;
import com.nac.slogbaa.iam.core.valueobject.PhoneNumber;
import com.nac.slogbaa.iam.core.valueobject.PhysicalAddress;
import com.nac.slogbaa.iam.core.valueobject.TraineeCategory;

import java.util.Objects;

/**
 * Trainee profile (name, address, category, phone, etc.). Part of Trainee aggregate.
 * No framework dependency.
 */
public final class Profile {
    private final FullName fullName;
    private final Gender gender;
    private final District district;
    private final String region;
    private final TraineeCategory category;
    private final PhysicalAddress address;
    private final PhoneNumber phoneNumber;

    public Profile(FullName fullName, Gender gender, District district, String region,
                   TraineeCategory category, PhysicalAddress address, PhoneNumber phoneNumber) {
        this.fullName = Objects.requireNonNull(fullName);
        this.gender = Objects.requireNonNull(gender);
        this.district = Objects.requireNonNull(district);
        this.region = region != null ? region.trim() : null;
        this.category = Objects.requireNonNull(category);
        this.address = address != null ? address : new PhysicalAddress(null, null, null);
        this.phoneNumber = phoneNumber;
    }

    public FullName getFullName() {
        return fullName;
    }

    public Gender getGender() {
        return gender;
    }

    public District getDistrict() {
        return district;
    }

    public String getRegion() {
        return region;
    }

    public TraineeCategory getCategory() {
        return category;
    }

    public PhysicalAddress getAddress() {
        return address;
    }

    public PhoneNumber getPhoneNumber() {
        return phoneNumber;
    }
}
