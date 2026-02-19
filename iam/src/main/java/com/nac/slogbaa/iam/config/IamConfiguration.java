package com.nac.slogbaa.iam.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.nac.slogbaa.iam.application.port.in.AuthenticateUserUseCase;
import com.nac.slogbaa.iam.application.port.in.ChangeStaffPasswordUseCase;
import com.nac.slogbaa.iam.application.port.in.CreateStaffUseCase;
import com.nac.slogbaa.iam.application.port.in.DeleteStaffUseCase;
import com.nac.slogbaa.iam.application.port.in.DeleteTraineeUseCase;
import com.nac.slogbaa.iam.application.port.in.GetAdminDashboardOverviewUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.RegisterTraineeUseCase;
import com.nac.slogbaa.iam.application.port.in.UpdateTraineeProfileUseCase;
import com.nac.slogbaa.iam.application.port.out.AuthTokenPort;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.application.service.AuthenticateUserService;
import com.nac.slogbaa.iam.application.service.ChangeStaffPasswordService;
import com.nac.slogbaa.iam.application.service.CreateStaffService;
import com.nac.slogbaa.iam.application.service.DeleteStaffService;
import com.nac.slogbaa.iam.application.service.DeleteTraineeService;
import com.nac.slogbaa.iam.application.service.GetAdminDashboardOverviewService;
import com.nac.slogbaa.iam.application.service.GetTraineeByIdService;
import com.nac.slogbaa.iam.application.service.RegisterTraineeService;
import com.nac.slogbaa.iam.application.service.UpdateTraineeProfileService;
import com.nac.slogbaa.shared.ports.StaffNotificationPort;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;

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
            PasswordHasherPort passwordHasher,
            TraineeNotificationPort traineeNotificationPort) {
        return new RegisterTraineeService(
                traineeRepository,
                staffUserRepository,
                passwordHasher,
                traineeNotificationPort
        );
    }

    @Bean
    public GetAdminDashboardOverviewUseCase getAdminDashboardOverviewUseCase(
            StaffUserRepositoryPort staffUserRepository,
            TraineeRepositoryPort traineeRepository) {
        return new GetAdminDashboardOverviewService(staffUserRepository, traineeRepository);
    }

    @Bean
    public ChangeStaffPasswordUseCase changeStaffPasswordUseCase(
            StaffUserRepositoryPort staffUserRepository,
            PasswordHasherPort passwordHasher) {
        return new ChangeStaffPasswordService(staffUserRepository, passwordHasher);
    }

    @Bean
    public CreateStaffUseCase createStaffUseCase(
            StaffUserRepositoryPort staffUserRepository,
            TraineeRepositoryPort traineeRepository,
            PasswordHasherPort passwordHasher,
            StaffNotificationPort staffNotificationPort) {
        return new CreateStaffService(
                staffUserRepository,
                traineeRepository,
                passwordHasher,
                staffNotificationPort
        );
    }

    @Bean
    public GetTraineeByIdUseCase getTraineeByIdUseCase(TraineeRepositoryPort traineeRepository) {
        return new GetTraineeByIdService(traineeRepository);
    }

    @Bean
    public UpdateTraineeProfileUseCase updateTraineeProfileUseCase(TraineeRepositoryPort traineeRepository) {
        return new UpdateTraineeProfileService(traineeRepository);
    }

    @Bean
    public DeleteTraineeUseCase deleteTraineeUseCase(TraineeRepositoryPort traineeRepository) {
        return new DeleteTraineeService(traineeRepository);
    }

    @Bean
    public DeleteStaffUseCase deleteStaffUseCase(StaffUserRepositoryPort staffUserRepository) {
        return new DeleteStaffService(staffUserRepository);
    }
}
