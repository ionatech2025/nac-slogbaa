package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;
import com.nac.slogbaa.iam.application.port.in.GetAllStaffUseCase;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import java.util.List;
import java.util.stream.Collectors;

public class GetAllStaffService implements GetAllStaffUseCase {

    private final StaffUserRepositoryPort staffUserRepositoryPort;

    public GetAllStaffService(StaffUserRepositoryPort staffUserRepositoryPort) {
        this.staffUserRepositoryPort = staffUserRepositoryPort;
    }

    @Override
    public List<StaffDetailsDto> getAll() {
        return staffUserRepositoryPort.findAll().stream()
                .map(staff -> new StaffDetailsDto(
                        staff.getId().getValue().toString(),
                        staff.getFullName(),
                        staff.getEmail().getValue(),
                        staff.getStaffRole().name(),
                        staff.isActive()
                ))
                .collect(Collectors.toList());
    }
}
