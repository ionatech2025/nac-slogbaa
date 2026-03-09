package com.nac.slogbaa.assessment.adapters.persistence.repository;

import com.nac.slogbaa.assessment.adapters.persistence.entity.TraineeAssessmentEntity;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaTraineeAssessmentRepository extends JpaRepository<TraineeAssessmentEntity, UUID> {

    Optional<TraineeAssessmentEntity> findByTraineeIdAndQuizId(UUID traineeId, UUID quizId);
}
