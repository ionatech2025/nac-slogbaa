package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.ModuleProgressEntity;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JpaModuleProgressRepository extends JpaRepository<ModuleProgressEntity, UUID> {

    Optional<ModuleProgressEntity> findByTraineeProgress_IdAndModuleId(UUID traineeProgressId, UUID moduleId);

    @Query("SELECT COUNT(m) FROM ModuleProgressEntity m WHERE m.traineeProgress.id = :traineeProgressId AND m.status = 'COMPLETED'")
    long countCompletedByTraineeProgressId(UUID traineeProgressId);
}
