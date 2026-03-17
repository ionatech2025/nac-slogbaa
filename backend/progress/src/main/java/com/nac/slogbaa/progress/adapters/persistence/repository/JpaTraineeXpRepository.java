package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeXpEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaTraineeXpRepository extends JpaRepository<TraineeXpEntity, UUID> {

    Optional<TraineeXpEntity> findByTraineeId(UUID traineeId);
}
