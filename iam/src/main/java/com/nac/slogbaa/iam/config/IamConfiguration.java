package com.nac.slogbaa.iam.config;

import com.nac.slogbaa.iam.application.port.in.AuthenticateUserUseCase;
import com.nac.slogbaa.iam.application.port.in.GetAdminDashboardOverviewUseCase;
import com.nac.slogbaa.iam.application.port.in.RegisterTraineeUseCase;
import com.nac.slogbaa.iam.application.port.out.AuthTokenPort;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.application.service.AuthenticateUserService;
import com.nac.slogbaa.iam.application.service.GetAdminDashboardOverviewService;
import com.nac.slogbaa.iam.application.service.RegisterTraineeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wires application use cases to their implementations (services) and injects port implementations (adapters).
 * Controllers depend on port.in (use cases); this config supplies the implementations.
 */
@Configuration
public class IamConfiguration {

    @Value("${app.jwt.expiry-seconds:86400}")
    private long tokenExpirySeconds;

    @Bean
    public AuthenticateUserUseCase authenticateUserUseCase(
            TraineeRepositoryPort traineeRepository,
            StaffUserRepositoryPort staffUserRepository,
            PasswordHasherPort passwordHasher,
            AuthTokenPort authTokenPort) {
        return new AuthenticateUserService(
                traineeRepository,
                staffUserRepository,
                passwordHasher,
                authTokenPort,
                tokenExpirySeconds
        );
    }

    @Bean
    public RegisterTraineeUseCase registerTraineeUseCase(
            TraineeRepositoryPort traineeRepository,
            StaffUserRepositoryPort staffUserRepository,
            PasswordHasherPort passwordHasher) {
        return new RegisterTraineeService(
                traineeRepository,
                staffUserRepository,
                passwordHasher
        );
    }

    @Bean
    public GetAdminDashboardOverviewUseCase getAdminDashboardOverviewUseCase(
            StaffUserRepositoryPort staffUserRepository,
            TraineeRepositoryPort traineeRepository) {
        return new GetAdminDashboardOverviewService(staffUserRepository, traineeRepository);
    }
}
