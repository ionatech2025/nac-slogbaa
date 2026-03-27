package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.command.ChangeTraineePasswordCommand;

/**
 * Use case: trainee user changes their own password (current + new).
 * No framework dependency.
 */
public interface ChangeTraineePasswordUseCase {

    void changePassword(ChangeTraineePasswordCommand command);
}
