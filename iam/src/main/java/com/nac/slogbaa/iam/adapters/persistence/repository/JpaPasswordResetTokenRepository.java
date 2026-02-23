package com.nac.slogbaa.iam.adapters.persistence.repository;

import com.nac.slogbaa.iam.adapters.persistence.entity.PasswordResetTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaPasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, UUID> {

    Optional<PasswordResetTokenEntity> findByToken(String token);
}
