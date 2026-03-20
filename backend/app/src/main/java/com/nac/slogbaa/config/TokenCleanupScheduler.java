package com.nac.slogbaa.config;

import com.nac.slogbaa.iam.application.port.out.EmailVerificationTokenRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.PasswordResetTokenRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Scheduled cleanup of expired tokens (password reset and email verification).
 * Runs every 6 hours to prevent table bloat.
 * Disabled in dev to avoid blocking on slow DB or lock contention during local development.
 */
@Component
@EnableScheduling
@Profile("!dev")
public class TokenCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(TokenCleanupScheduler.class);

    private final PasswordResetTokenRepositoryPort passwordResetTokenRepository;
    private final EmailVerificationTokenRepositoryPort emailVerificationTokenRepository;

    public TokenCleanupScheduler(PasswordResetTokenRepositoryPort passwordResetTokenRepository,
                                 EmailVerificationTokenRepositoryPort emailVerificationTokenRepository) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
    }

    // Initial delay so first run doesn't block startup (e.g. slow DB or lock contention)
    @Scheduled(initialDelay = 60_000, fixedRate = 6 * 60 * 60 * 1000) // first run after 1 min, then every 6 hours
    @Transactional
    public void cleanupExpiredTokens() {
        int deletedReset = passwordResetTokenRepository.deleteExpired();
        if (deletedReset > 0) {
            log.info("Cleaned up {} expired password reset tokens", deletedReset);
        }
        int deletedVerification = emailVerificationTokenRepository.deleteExpired();
        if (deletedVerification > 0) {
            log.info("Cleaned up {} expired email verification tokens", deletedVerification);
        }
    }
}
