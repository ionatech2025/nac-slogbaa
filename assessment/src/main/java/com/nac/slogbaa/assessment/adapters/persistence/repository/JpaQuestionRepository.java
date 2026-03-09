package com.nac.slogbaa.assessment.adapters.persistence.repository;

import com.nac.slogbaa.assessment.adapters.persistence.entity.QuestionEntity;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaQuestionRepository extends JpaRepository<QuestionEntity, UUID> {
}
