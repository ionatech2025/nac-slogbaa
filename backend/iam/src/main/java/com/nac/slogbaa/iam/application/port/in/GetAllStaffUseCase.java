package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;
import java.util.List;

public interface GetAllStaffUseCase {
    List<StaffDetailsDto> getAll();
}
