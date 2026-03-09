package com.nac.slogbaa.assessment.adapters.persistence.repository;

import com.nac.slogbaa.assessment.adapters.persistence.entity.QuizEntity;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaQuizRepository extends JpaRepository<QuizEntity, UUID> {

    Optional<QuizEntity> findByModuleId(UUID moduleId);

    boolean existsByModuleId(UUID moduleId);
}
