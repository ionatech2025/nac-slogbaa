package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeStreakEntity;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaTraineeStreakRepository extends JpaRepository<TraineeStreakEntity, UUID> {

    Optional<TraineeStreakEntity> findByTraineeId(UUID traineeId);
}
