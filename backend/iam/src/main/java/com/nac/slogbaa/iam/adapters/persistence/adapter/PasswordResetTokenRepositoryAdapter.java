package com.nac.slogbaa.iam.adapters.persistence.adapter;

import com.nac.slogbaa.iam.adapters.persistence.entity.PasswordResetTokenEntity;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaPasswordResetTokenRepository;
import com.nac.slogbaa.iam.application.port.out.PasswordResetTokenRepositoryPort;
import com.nac.slogbaa.iam.core.entity.PasswordResetToken;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Component
public class PasswordResetTokenRepositoryAdapter implements PasswordResetTokenRepositoryPort {

    private final JpaPasswordResetTokenRepository jpaRepository;

    public PasswordResetTokenRepositoryAdapter(JpaPasswordResetTokenRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public void save(PasswordResetToken token) {
        PasswordResetTokenEntity entity = new PasswordResetTokenEntity();
        entity.setToken(token.getToken());
        entity.setUserEmail(token.getUserEmail());
        entity.setExpiryDate(token.getExpiryDate());
        jpaRepository.save(entity);
    }

    @Override
    public Optional<PasswordResetToken> findByToken(String token) {
        return jpaRepository.findByToken(token)
                .map(e -> new PasswordResetToken(e.getToken(), e.getUserEmail(), e.getExpiryDate()));
    }

    @Override
    public void deleteByToken(String token) {
        jpaRepository.findByToken(token).ifPresent(jpaRepository::delete);
    }

    @Override
    @Transactional
    public int deleteExpired() {
        return jpaRepository.deleteExpiredBefore(Instant.now());
    }
}
