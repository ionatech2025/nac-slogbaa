package com.nac.slogbaa.iam.adapters.persistence.repository;

import com.nac.slogbaa.iam.adapters.persistence.entity.EmailVerificationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface JpaEmailVerificationTokenRepository extends JpaRepository<EmailVerificationTokenEntity, UUID> {

    Optional<EmailVerificationTokenEntity> findByToken(String token);

    @Modifying
    @Query("DELETE FROM EmailVerificationTokenEntity t WHERE t.userEmail = :userEmail")
    int deleteByUserEmail(String userEmail);

    @Modifying
    @Query("DELETE FROM EmailVerificationTokenEntity t WHERE t.expiryDate < :cutoff")
    int deleteExpiredBefore(Instant cutoff);
}
