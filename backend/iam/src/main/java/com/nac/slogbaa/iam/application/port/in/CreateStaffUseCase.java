package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.command.CreateStaffCommand;
import com.nac.slogbaa.iam.application.dto.result.CreateStaffResult;

/**
 * Use case: create a new staff user (ADMIN or SUPER_ADMIN). Sends credentials by email.
 * Only SUPER_ADMIN may call this. Role limits: max 3 SUPER_ADMIN, max 5 ADMIN.
 */
public interface CreateStaffUseCase {

    CreateStaffResult create(CreateStaffCommand command);
}
