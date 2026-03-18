package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.ModuleProgressEntity;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JpaModuleProgressRepository extends JpaRepository<ModuleProgressEntity, UUID> {

    Optional<ModuleProgressEntity> findByTraineeProgress_IdAndModuleId(UUID traineeProgressId, UUID moduleId);

    @Query("SELECT COUNT(m) FROM ModuleProgressEntity m WHERE m.traineeProgress.id = :traineeProgressId AND m.status = 'COMPLETED'")
    long countCompletedByTraineeProgressId(UUID traineeProgressId);

    @Query("SELECT COUNT(m) FROM ModuleProgressEntity m WHERE m.moduleId = :moduleId AND m.status = 'COMPLETED'")
    long countCompletedByModuleId(UUID moduleId);

    @Query("SELECT m FROM ModuleProgressEntity m WHERE m.traineeProgress.id = :traineeProgressId AND m.status = 'COMPLETED'")
    java.util.List<ModuleProgressEntity> findByTraineeProgressIdAndStatusCompleted(UUID traineeProgressId);

    @Query("SELECT mp.traineeProgress.id, mp.moduleId FROM ModuleProgressEntity mp " +
           "WHERE mp.traineeProgress.id IN :progressIds AND mp.status = 'COMPLETED'")
    List<Object[]> findCompletedModulesByProgressIds(@Param("progressIds") Collection<UUID> progressIds);
}
