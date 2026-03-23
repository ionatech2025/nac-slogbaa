package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.port.in.PasswordResetUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.PasswordResetTokenRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.entity.PasswordResetToken;
import com.nac.slogbaa.iam.core.exception.InvalidResetTokenException;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.shared.ports.PasswordResetNotificationPort;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Application service for password reset flow.
 */
public final class PasswordResetService implements PasswordResetUseCase {

    private static final Duration TOKEN_VALIDITY = Duration.ofMinutes(15);

    private final TraineeRepositoryPort traineeRepository;
    private final StaffUserRepositoryPort staffUserRepository;
    private final PasswordResetTokenRepositoryPort tokenRepository;
    private final PasswordHasherPort passwordHasher;
    private final PasswordResetNotificationPort notificationPort;
    private final String resetBaseUrl;

    public PasswordResetService(TraineeRepositoryPort traineeRepository,
                                StaffUserRepositoryPort staffUserRepository,
                                PasswordResetTokenRepositoryPort tokenRepository,
                                PasswordHasherPort passwordHasher,
                                PasswordResetNotificationPort notificationPort,
                                String resetBaseUrl) {
        this.traineeRepository = traineeRepository;
        this.staffUserRepository = staffUserRepository;
        this.tokenRepository = tokenRepository;
        this.passwordHasher = passwordHasher;
        this.notificationPort = notificationPort;
        this.resetBaseUrl = resetBaseUrl != null ? resetBaseUrl : "";
    }

    @Override
    public void initiateReset(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        String trimmedEmail = email.trim().toLowerCase();
        Email emailVo = new Email(trimmedEmail);

        boolean userExists = traineeRepository.findByEmail(emailVo).isPresent()
                || staffUserRepository.findByEmail(emailVo).isPresent();
        if (!userExists) {
            return;
        }

        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(TOKEN_VALIDITY);
        PasswordResetToken resetToken = new PasswordResetToken(token, trimmedEmail, expiryDate);
        tokenRepository.save(resetToken);

        String resetUrl = resetBaseUrl.replaceAll("/$", "") + "/reset-password?token=" + token;
        notificationPort.sendResetLink(trimmedEmail, token, resetUrl);
    }

    @Override
    public boolean validateResetToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        Optional<PasswordResetToken> opt = tokenRepository.findByToken(token);
        if (opt.isEmpty()) {
            return false;
        }
        PasswordResetToken resetToken = opt.get();
        if (resetToken.isExpired()) {
            return false;
        }
        Email emailVo = new Email(resetToken.getUserEmail());
        boolean userExists = traineeRepository.findByEmail(emailVo).isPresent()
                || staffUserRepository.findByEmail(emailVo).isPresent();
        return userExists;
    }

    @Override
    public void completeReset(String token, String newPassword) {
        if (token == null || token.isBlank()) {
            throw new InvalidResetTokenException();
        }
        if (newPassword == null || newPassword.length() < 12) {
            throw new IllegalArgumentException("Password must be at least 12 characters");
        }

        Optional<PasswordResetToken> opt = tokenRepository.findByToken(token);
        if (opt.isEmpty()) {
            throw new InvalidResetTokenException();
        }
        PasswordResetToken resetToken = opt.get();
        if (resetToken.isExpired()) {
            tokenRepository.deleteByToken(token);
            throw new InvalidResetTokenException();
        }

        Email emailVo = new Email(resetToken.getUserEmail());
        String newHash = passwordHasher.hash(newPassword);

        Optional<Trainee> traineeOpt = traineeRepository.findByEmail(emailVo);
        if (traineeOpt.isPresent()) {
            traineeRepository.updatePasswordHash(traineeOpt.get().getId().getValue(), newHash);
        } else {
            Optional<StaffUser> staffOpt = staffUserRepository.findByEmail(emailVo);
            if (staffOpt.isPresent()) {
                staffUserRepository.updatePasswordHash(staffOpt.get().getId(), newHash);
            } else {
                throw new InvalidResetTokenException();
            }
        }

        tokenRepository.deleteByToken(token);
    }
}
