package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.VerifyEmailUseCase;
import com.nac.slogbaa.iam.application.port.out.EmailVerificationTokenRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.entity.EmailVerificationToken;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.shared.ports.EmailVerificationNotificationPort;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Application service for email verification flow.
 */
public final class VerifyEmailService implements VerifyEmailUseCase {

    private static final Duration TOKEN_VALIDITY = Duration.ofHours(24);

    private final TraineeRepositoryPort traineeRepository;
    private final EmailVerificationTokenRepositoryPort tokenRepository;
    private final EmailVerificationNotificationPort notificationPort;
    private final String baseUrl;

    public VerifyEmailService(TraineeRepositoryPort traineeRepository,
                              EmailVerificationTokenRepositoryPort tokenRepository,
                              EmailVerificationNotificationPort notificationPort,
                              String baseUrl) {
        this.traineeRepository = traineeRepository;
        this.tokenRepository = tokenRepository;
        this.notificationPort = notificationPort;
        // Use first URL if value is comma-separated (e.g. misconfigured like CORS list)
        this.baseUrl = (baseUrl != null && baseUrl.contains(","))
                ? baseUrl.split(",")[0].trim()
                : (baseUrl != null ? baseUrl : "");
    }

    @Override
    public void sendVerificationEmail(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        String trimmedEmail = email.trim().toLowerCase();
        Email emailVo = new Email(trimmedEmail);

        Optional<Trainee> traineeOpt = traineeRepository.findByEmail(emailVo);
        if (traineeOpt.isEmpty()) {
            return;
        }
        Trainee trainee = traineeOpt.get();

        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(TOKEN_VALIDITY);
        EmailVerificationToken verificationToken = new EmailVerificationToken(token, trimmedEmail, expiryDate);
        tokenRepository.save(verificationToken);

        String fullName = trainee.getProfile().getFullName().getFirstName() + " "
                + trainee.getProfile().getFullName().getLastName();
        String verificationUrl = baseUrl.replaceAll("/$", "") + "/auth/verify-email?token=" + token;
        notificationPort.sendVerificationLink(trimmedEmail, fullName, verificationUrl);
    }

    @Override
    public boolean verify(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        Optional<EmailVerificationToken> opt = tokenRepository.findByToken(token);
        if (opt.isEmpty()) {
            return false;
        }
        EmailVerificationToken verificationToken = opt.get();
        if (verificationToken.isExpired()) {
            tokenRepository.deleteByToken(token);
            return false;
        }

        Email emailVo = new Email(verificationToken.getUserEmail());
        Optional<Trainee> traineeOpt = traineeRepository.findByEmail(emailVo);
        if (traineeOpt.isEmpty()) {
            return false;
        }

        traineeRepository.setEmailVerified(traineeOpt.get().getId().getValue(), true);
        tokenRepository.deleteByToken(token);
        return true;
    }

    @Override
    public void resendVerification(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        String trimmedEmail = email.trim().toLowerCase();
        tokenRepository.deleteByUserEmail(trimmedEmail);
        sendVerificationEmail(trimmedEmail);
    }
}
