package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeBadgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaTraineeBadgeRepository extends JpaRepository<TraineeBadgeEntity, UUID> {

    List<TraineeBadgeEntity> findByTraineeId(UUID traineeId);

    boolean existsByTraineeIdAndBadgeId(UUID traineeId, UUID badgeId);
}
