package com.nac.slogbaa.assessment.application.service;

import com.nac.slogbaa.assessment.application.dto.QuizForAttemptDto;
import com.nac.slogbaa.assessment.application.port.in.GetQuizForAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;
import com.nac.slogbaa.assessment.application.port.out.QuizStorePort;

import java.util.Optional;
import java.util.UUID;

public final class GetQuizForAttemptService implements GetQuizForAttemptUseCase {

    private final QuizStorePort quizStore;
    private final AttemptPort attemptPort;

    public GetQuizForAttemptService(QuizStorePort quizStore, AttemptPort attemptPort) {
        this.quizStore = quizStore;
        this.attemptPort = attemptPort;
    }

    @Override
    public Optional<QuizForAttemptDto> getByModuleId(UUID moduleId) {
        return quizStore.findByModuleId(moduleId)
                .flatMap(q -> attemptPort.getQuizForAttempt(q.id()));
    }
}
