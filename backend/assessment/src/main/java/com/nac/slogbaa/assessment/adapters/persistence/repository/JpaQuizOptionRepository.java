package com.nac.slogbaa.assessment.adapters.persistence.repository;

import com.nac.slogbaa.assessment.adapters.persistence.entity.QuizOptionEntity;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaQuizOptionRepository extends JpaRepository<QuizOptionEntity, UUID> {
}
