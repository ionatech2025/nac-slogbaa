package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.BadgeDefinitionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaBadgeDefinitionRepository extends JpaRepository<BadgeDefinitionEntity, UUID> {

    Optional<BadgeDefinitionEntity> findByTriggerType(String triggerType);
}
