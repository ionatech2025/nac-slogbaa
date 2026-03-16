package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.command.RegisterTraineeCommand;
import com.nac.slogbaa.iam.application.dto.result.RegisterTraineeResult;

/**
 * Inbound port: register a new trainee (self-service).
 */
public interface RegisterTraineeUseCase {

    RegisterTraineeResult register(RegisterTraineeCommand command);
}
