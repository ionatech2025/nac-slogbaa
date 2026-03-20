package com.nac.slogbaa.iam.adapters.persistence.adapter;

import com.nac.slogbaa.iam.adapters.persistence.entity.EmailVerificationTokenEntity;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaEmailVerificationTokenRepository;
import com.nac.slogbaa.iam.application.port.out.EmailVerificationTokenRepositoryPort;
import com.nac.slogbaa.iam.core.entity.EmailVerificationToken;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Component
public class EmailVerificationTokenRepositoryAdapter implements EmailVerificationTokenRepositoryPort {

    private final JpaEmailVerificationTokenRepository jpaRepository;

    public EmailVerificationTokenRepositoryAdapter(JpaEmailVerificationTokenRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public void save(EmailVerificationToken token) {
        EmailVerificationTokenEntity entity = new EmailVerificationTokenEntity();
        entity.setToken(token.getToken());
        entity.setUserEmail(token.getUserEmail());
        entity.setExpiryDate(token.getExpiryDate());
        jpaRepository.save(entity);
    }

    @Override
    public Optional<EmailVerificationToken> findByToken(String token) {
        return jpaRepository.findByToken(token)
                .map(e -> new EmailVerificationToken(e.getToken(), e.getUserEmail(), e.getExpiryDate()));
    }

    @Override
    public void deleteByToken(String token) {
        jpaRepository.findByToken(token).ifPresent(jpaRepository::delete);
    }

    @Override
    @Transactional
    public void deleteByUserEmail(String userEmail) {
        jpaRepository.deleteByUserEmail(userEmail);
    }

    @Override
    @Transactional
    public int deleteExpired() {
        return jpaRepository.deleteExpiredBefore(Instant.now());
    }
}
