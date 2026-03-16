package com.nac.slogbaa.config;

import com.nac.slogbaa.iam.adapters.persistence.repository.JpaEmailVerificationTokenRepository;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaPasswordResetTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Scheduled cleanup of expired tokens (password reset and email verification).
 * Runs every 6 hours to prevent table bloat.
 */
@Component
@EnableScheduling
public class TokenCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(TokenCleanupScheduler.class);

    private final JpaPasswordResetTokenRepository passwordResetTokenRepository;
    private final JpaEmailVerificationTokenRepository emailVerificationTokenRepository;

    public TokenCleanupScheduler(JpaPasswordResetTokenRepository passwordResetTokenRepository,
                                 JpaEmailVerificationTokenRepository emailVerificationTokenRepository) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
    }

    @Scheduled(fixedRate = 6 * 60 * 60 * 1000) // every 6 hours
    @Transactional
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        int deletedReset = passwordResetTokenRepository.deleteExpiredBefore(now);
        if (deletedReset > 0) {
            log.info("Cleaned up {} expired password reset tokens", deletedReset);
        }
        int deletedVerification = emailVerificationTokenRepository.deleteExpiredBefore(now);
        if (deletedVerification > 0) {
            log.info("Cleaned up {} expired email verification tokens", deletedVerification);
        }
    }
}
