package com.nac.slogbaa.assessment.adapters.persistence.repository;

import com.nac.slogbaa.assessment.adapters.persistence.entity.QuizAttemptEntity;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaQuizAttemptRepository extends JpaRepository<QuizAttemptEntity, UUID> {

    List<QuizAttemptEntity> findByTraineeAssessmentIdOrderByAttemptNumberDesc(UUID traineeAssessmentId);
}
