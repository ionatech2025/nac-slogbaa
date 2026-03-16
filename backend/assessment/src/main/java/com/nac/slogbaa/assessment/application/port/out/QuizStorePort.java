package com.nac.slogbaa.assessment.application.port.out;

import com.nac.slogbaa.assessment.application.dto.QuizDto;

import java.util.Optional;
import java.util.UUID;

/**
 * Port for persisting and loading quizzes (with questions and options).
 */
public interface QuizStorePort {

    QuizDto save(QuizDto dto);

    Optional<QuizDto> findById(UUID quizId);

    Optional<QuizDto> findByModuleId(UUID moduleId);

    void deleteById(UUID quizId);

    boolean existsByModuleId(UUID moduleId);
}
