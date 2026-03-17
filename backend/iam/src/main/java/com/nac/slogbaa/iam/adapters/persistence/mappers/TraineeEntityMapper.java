package com.nac.slogbaa.iam.adapters.persistence.mappers;

import com.nac.slogbaa.iam.adapters.persistence.entity.TraineeEntity;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.entity.Profile;
import com.nac.slogbaa.iam.core.valueobject.*;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TraineeEntityMapper {

    public Trainee toDomain(TraineeEntity e) {
        if (e == null) return null;
        Email email = new Email(e.getEmail());
        FullName fullName = new FullName(e.getFirstName(), e.getLastName());
        Gender gender = Gender.valueOf(e.getGender().name());
        District district = new District(e.getDistrictName());
        PhysicalAddress address = new PhysicalAddress(e.getStreet(), e.getCity(), e.getPostalCode());
        TraineeCategory category = TraineeCategory.valueOf(e.getTraineeCategory().name());
        PhoneNumber phone = null;
        if (e.getPhoneCountryCode() != null && e.getPhoneNationalNumber() != null) {
            phone = new PhoneNumber(e.getPhoneCountryCode(), e.getPhoneNationalNumber());
        }
        Profile profile = new Profile(fullName, gender, district, e.getRegion(), category, address, phone);
        return new Trainee(
                new TraineeId(e.getId()),
                email,
                e.getPasswordHash(),
                profile,
                e.isActive(),
                e.getRegistrationDate(),
                e.isEmailVerified(),
                e.getProfileImageUrl()
        );
    }

    public TraineeEntity toEntity(Trainee domain) {
        if (domain == null) return null;
        TraineeEntity e = new TraineeEntity();
        e.setId(domain.getId().getValue());
        e.setEmail(domain.getEmail().getValue());
        e.setPasswordHash(domain.getPasswordHash());
        e.setFirstName(domain.getProfile().getFullName().getFirstName());
        e.setLastName(domain.getProfile().getFullName().getLastName());
        e.setGender(TraineeEntity.GenderEnum.valueOf(domain.getProfile().getGender().name()));
        e.setDistrictName(domain.getProfile().getDistrict().getName());
        e.setRegion(domain.getProfile().getRegion());
        e.setTraineeCategory(TraineeEntity.TraineeCategoryEnum.valueOf(domain.getProfile().getCategory().name()));
        e.setStreet(domain.getProfile().getAddress().getStreet());
        e.setCity(domain.getProfile().getAddress().getCity());
        e.setPostalCode(domain.getProfile().getAddress().getPostalCode());
        if (domain.getProfile().getPhoneNumber() != null && domain.getProfile().getPhoneNumber().isPresent()) {
            e.setPhoneCountryCode(domain.getProfile().getPhoneNumber().getCountryCode());
            e.setPhoneNationalNumber(domain.getProfile().getPhoneNumber().getNationalNumber());
        } else {
            e.setPhoneCountryCode(null);
            e.setPhoneNationalNumber(null);
        }
        e.setActive(domain.isActive());
        e.setRegistrationDate(domain.getRegistrationDate());
        e.setEmailVerified(domain.isEmailVerified());
        e.setProfileImageUrl(domain.getProfileImageUrl());
        e.setCreatedAt(domain.getRegistrationDate());
        e.setUpdatedAt(domain.getRegistrationDate());
        return e;
    }
}
