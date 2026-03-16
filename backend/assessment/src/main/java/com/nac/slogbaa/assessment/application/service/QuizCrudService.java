package com.nac.slogbaa.assessment.application.service;

import com.nac.slogbaa.assessment.application.dto.QuizDto;
import com.nac.slogbaa.assessment.application.port.in.QuizCrudUseCase;
import com.nac.slogbaa.assessment.application.port.out.QuizStorePort;

import java.util.Optional;
import java.util.UUID;

public final class QuizCrudService implements QuizCrudUseCase {

    private final QuizStorePort quizStore;

    public QuizCrudService(QuizStorePort quizStore) {
        this.quizStore = quizStore;
    }

    @Override
    public QuizDto create(QuizDto dto) {
        if (dto.moduleId() == null) throw new IllegalArgumentException("moduleId required");
        if (quizStore.existsByModuleId(dto.moduleId())) throw new IllegalStateException("Quiz already exists for this module");
        QuizDto withId = new QuizDto(
                dto.id() != null ? dto.id() : UUID.randomUUID(),
                dto.moduleId(),
                dto.title(),
                dto.passThresholdPercent(),
                dto.maxAttempts(),
                dto.timeLimitMinutes(),
                dto.questions()
        );
        return quizStore.save(withId);
    }

    @Override
    public QuizDto update(QuizDto dto) {
        if (dto.id() == null) throw new IllegalArgumentException("quiz id required");
        return quizStore.save(dto);
    }

    @Override
    public Optional<QuizDto> getById(UUID quizId) {
        return quizStore.findById(quizId);
    }

    @Override
    public Optional<QuizDto> getByModuleId(UUID moduleId) {
        return quizStore.findByModuleId(moduleId);
    }

    @Override
    public void delete(UUID quizId) {
        quizStore.deleteById(quizId);
    }
}
