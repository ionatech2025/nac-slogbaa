package com.nac.slogbaa.iam.adapters.persistence.repository;

import com.nac.slogbaa.iam.adapters.persistence.entity.TraineeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaTraineeRepository extends JpaRepository<TraineeEntity, UUID> {

    Optional<TraineeEntity> findByEmail(String email);
}
