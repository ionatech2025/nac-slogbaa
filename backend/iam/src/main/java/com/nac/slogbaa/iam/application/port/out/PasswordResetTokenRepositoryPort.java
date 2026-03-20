package com.nac.slogbaa.iam.application.port.out;

import com.nac.slogbaa.iam.core.entity.PasswordResetToken;

import java.util.Optional;

/**
 * Port for persisting password reset tokens. Implementations (JPA) in adapters.
 */
public interface PasswordResetTokenRepositoryPort {

    void save(PasswordResetToken token);

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByToken(String token);

    /**
     * Delete all tokens with expiry date before now. Returns the number of rows deleted.
     */
    int deleteExpired();
}
