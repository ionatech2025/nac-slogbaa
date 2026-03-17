package com.nac.slogbaa.iam.application.port.out;

import com.nac.slogbaa.iam.core.entity.EmailVerificationToken;

import java.util.Optional;

/**
 * Port for persisting email verification tokens. Implementations (JPA) in adapters.
 */
public interface EmailVerificationTokenRepositoryPort {

    void save(EmailVerificationToken token);

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByToken(String token);

    void deleteByUserEmail(String userEmail);

    void deleteExpired();
}
