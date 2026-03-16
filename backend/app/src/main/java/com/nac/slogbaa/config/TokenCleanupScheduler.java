package com.nac.slogbaa.config;

import com.nac.slogbaa.iam.adapters.persistence.repository.JpaPasswordResetTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Scheduled cleanup of expired password reset tokens.
 * Runs every 6 hours to prevent table bloat.
 */
@Component
@EnableScheduling
public class TokenCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(TokenCleanupScheduler.class);

    private final JpaPasswordResetTokenRepository tokenRepository;

    public TokenCleanupScheduler(JpaPasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Scheduled(fixedRate = 6 * 60 * 60 * 1000) // every 6 hours
    @Transactional
    public void cleanupExpiredTokens() {
        int deleted = tokenRepository.deleteExpiredBefore(Instant.now());
        if (deleted > 0) {
            log.info("Cleaned up {} expired password reset tokens", deleted);
        }
    }
}
