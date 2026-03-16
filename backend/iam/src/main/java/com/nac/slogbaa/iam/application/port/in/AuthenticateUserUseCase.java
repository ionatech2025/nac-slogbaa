package com.nac.slogbaa.iam.application.port.in;

import com.nac.slogbaa.iam.application.dto.command.AuthenticationCommand;
import com.nac.slogbaa.iam.application.dto.result.AuthenticationResult;

/**
 * Inbound port: authenticate user (trainee or staff) by email and password.
 * Returns token and user info on success.
 */
public interface AuthenticateUserUseCase {

    AuthenticationResult authenticate(AuthenticationCommand command);
}
