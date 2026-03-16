package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;
import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;

import java.util.Optional;
import java.util.UUID;

/**
 * Application service: get staff details by id.
 */
public final class GetStaffByIdService implements GetStaffByIdUseCase {

    private final StaffUserRepositoryPort staffUserRepository;

    public GetStaffByIdService(StaffUserRepositoryPort staffUserRepository) {
        this.staffUserRepository = staffUserRepository;
    }

    @Override
    public Optional<StaffDetailsDto> getById(UUID staffId) {
        return staffUserRepository.findById(StaffUserId.of(staffId)).map(this::toDetails);
    }

    private StaffDetailsDto toDetails(StaffUser u) {
        return new StaffDetailsDto(
                u.getId().getValue().toString(),
                u.getFullName(),
                u.getEmail().getValue(),
                u.getStaffRole().name(),
                u.isActive()
        );
    }
}
