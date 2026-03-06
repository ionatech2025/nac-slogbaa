package com.nac.slogbaa.assessment.adapters.persistence.repository;

import com.nac.slogbaa.assessment.adapters.persistence.entity.QuizAnswerEntity;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaQuizAnswerRepository extends JpaRepository<QuizAnswerEntity, UUID> {
}
