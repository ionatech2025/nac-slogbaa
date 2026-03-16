package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeSettingsEntity;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaTraineeSettingsRepository extends JpaRepository<TraineeSettingsEntity, UUID> {

    Optional<TraineeSettingsEntity> findByTraineeId(UUID traineeId);
}
