package com.nac.slogbaa.assessment.application.port.in;

import com.nac.slogbaa.assessment.application.dto.QuizDto;

import java.util.Optional;
import java.util.UUID;

public interface QuizCrudUseCase {

    QuizDto create(QuizDto dto);

    QuizDto update(QuizDto dto);

    Optional<QuizDto> getById(UUID quizId);

    Optional<QuizDto> getByModuleId(UUID moduleId);

    void delete(UUID quizId);
}
