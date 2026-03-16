package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.command.ChangeStaffPasswordCommand;

/**
 * Use case: staff user changes their own password (current + new).
 * No framework dependency.
 */
public interface ChangeStaffPasswordUseCase {

    void changePassword(ChangeStaffPasswordCommand command);
}
