package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeProgressEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaTraineeProgressRepository extends JpaRepository<TraineeProgressEntity, UUID> {

    boolean existsByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    Optional<TraineeProgressEntity> findOneByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    List<TraineeProgressEntity> findByTraineeIdOrderByEnrollmentDateDesc(UUID traineeId);

    long countByCourseId(UUID courseId);

    List<TraineeProgressEntity> findByCourseIdOrderByEnrollmentDateDesc(UUID courseId);
}
