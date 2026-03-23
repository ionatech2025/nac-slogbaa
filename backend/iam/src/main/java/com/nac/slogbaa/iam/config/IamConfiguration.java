package com.nac.slogbaa.iam.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.nac.slogbaa.shared.util.FrontendAppBaseUrl;

import com.nac.slogbaa.iam.application.port.in.AuthenticateUserUseCase;
import com.nac.slogbaa.iam.application.port.in.ChangeStaffPasswordUseCase;
import com.nac.slogbaa.iam.application.port.in.CreateStaffUseCase;
import com.nac.slogbaa.iam.application.port.in.DeleteStaffUseCase;
import com.nac.slogbaa.iam.application.port.in.DeleteTraineeUseCase;
import com.nac.slogbaa.iam.application.port.in.GetAdminDashboardOverviewUseCase;
import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.RegisterTraineeUseCase;
import com.nac.slogbaa.iam.application.port.in.SetStaffActiveUseCase;
import com.nac.slogbaa.iam.application.port.in.SetStaffPasswordByAdminUseCase;
import com.nac.slogbaa.iam.application.port.in.SetTraineePasswordByAdminUseCase;
import com.nac.slogbaa.iam.application.port.in.SoftDeleteAccountUseCase;
import com.nac.slogbaa.iam.application.port.in.UpdateStaffProfileByAdminUseCase;
import com.nac.slogbaa.iam.application.port.in.PasswordResetUseCase;
import com.nac.slogbaa.iam.application.port.in.UpdateTraineeProfileUseCase;
import com.nac.slogbaa.iam.application.port.in.VerifyEmailUseCase;
import com.nac.slogbaa.iam.application.port.out.AuthTokenPort;
import com.nac.slogbaa.iam.application.port.out.EmailVerificationTokenRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.PasswordResetTokenRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.application.service.AuthenticateUserService;
import com.nac.slogbaa.iam.application.service.ChangeStaffPasswordService;
import com.nac.slogbaa.iam.application.service.CreateStaffService;
import com.nac.slogbaa.iam.application.service.DeleteStaffService;
import com.nac.slogbaa.iam.application.service.DeleteTraineeService;
import com.nac.slogbaa.iam.application.service.GetAdminDashboardOverviewService;
import com.nac.slogbaa.iam.application.service.GetStaffByIdService;
import com.nac.slogbaa.iam.application.service.GetTraineeByIdService;
import com.nac.slogbaa.iam.application.service.PasswordResetService;
import com.nac.slogbaa.iam.application.service.SetStaffActiveService;
import com.nac.slogbaa.iam.application.service.SetStaffPasswordByAdminService;
import com.nac.slogbaa.iam.application.service.SetTraineePasswordByAdminService;
import com.nac.slogbaa.iam.application.service.UpdateStaffProfileByAdminService;
import com.nac.slogbaa.iam.application.service.RegisterTraineeService;
import com.nac.slogbaa.iam.application.service.SoftDeleteAccountService;
import com.nac.slogbaa.iam.application.service.UpdateTraineeProfileService;
import com.nac.slogbaa.iam.application.service.VerifyEmailService;
import com.nac.slogbaa.shared.ports.EmailVerificationNotificationPort;
import com.nac.slogbaa.shared.ports.PasswordResetNotificationPort;
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

    private static String resolveFrontendBaseUrl(Environment env) {
        String raw = env.getProperty("app.password-reset.base-url", "http://localhost:5173");
        boolean prod = FrontendAppBaseUrl.isProductionProfile(env.getProperty("spring.profiles.active", ""));
        return FrontendAppBaseUrl.normalize(raw, prod);
    }

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
    public VerifyEmailUseCase verifyEmailUseCase(
            TraineeRepositoryPort traineeRepository,
            EmailVerificationTokenRepositoryPort tokenRepository,
            EmailVerificationNotificationPort notificationPort,
            Environment env) {
        return new VerifyEmailService(
                traineeRepository,
                tokenRepository,
                notificationPort,
                resolveFrontendBaseUrl(env)
        );
    }

    @Bean
    public RegisterTraineeUseCase registerTraineeUseCase(
            TraineeRepositoryPort traineeRepository,
            StaffUserRepositoryPort staffUserRepository,
            PasswordHasherPort passwordHasher,
            VerifyEmailUseCase verifyEmailUseCase) {
        return new RegisterTraineeService(
                traineeRepository,
                staffUserRepository,
                passwordHasher,
                verifyEmailUseCase
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
    public GetStaffByIdUseCase getStaffByIdUseCase(StaffUserRepositoryPort staffUserRepository) {
        return new GetStaffByIdService(staffUserRepository);
    }

    @Bean
    public SetStaffPasswordByAdminUseCase setStaffPasswordByAdminUseCase(
            StaffUserRepositoryPort staffUserRepository,
            PasswordHasherPort passwordHasher,
            StaffNotificationPort staffNotificationPort) {
        return new SetStaffPasswordByAdminService(staffUserRepository, passwordHasher, staffNotificationPort);
    }

    @Bean
    public SetTraineePasswordByAdminUseCase setTraineePasswordByAdminUseCase(
            TraineeRepositoryPort traineeRepository,
            PasswordHasherPort passwordHasher,
            TraineeNotificationPort traineeNotificationPort) {
        return new SetTraineePasswordByAdminService(traineeRepository, passwordHasher, traineeNotificationPort);
    }

    @Bean
    public SetStaffActiveUseCase setStaffActiveUseCase(StaffUserRepositoryPort staffUserRepository) {
        return new SetStaffActiveService(staffUserRepository);
    }

    @Bean
    public UpdateStaffProfileByAdminUseCase updateStaffProfileByAdminUseCase(
            StaffUserRepositoryPort staffUserRepository,
            TraineeRepositoryPort traineeRepository) {
        return new UpdateStaffProfileByAdminService(staffUserRepository, traineeRepository);
    }

    @Bean
    public DeleteStaffUseCase deleteStaffUseCase(StaffUserRepositoryPort staffUserRepository) {
        return new DeleteStaffService(staffUserRepository);
    }

    @Bean
    public PasswordResetUseCase passwordResetUseCase(
            TraineeRepositoryPort traineeRepository,
            StaffUserRepositoryPort staffUserRepository,
            PasswordResetTokenRepositoryPort tokenRepository,
            PasswordHasherPort passwordHasher,
            PasswordResetNotificationPort notificationPort,
            Environment env) {
        return new PasswordResetService(
                traineeRepository,
                staffUserRepository,
                tokenRepository,
                passwordHasher,
                notificationPort,
                resolveFrontendBaseUrl(env)
        );
    }

    @Bean
    public SoftDeleteAccountUseCase softDeleteAccountUseCase(TraineeRepositoryPort traineeRepository) {
        return new SoftDeleteAccountService(traineeRepository);
    }
}
