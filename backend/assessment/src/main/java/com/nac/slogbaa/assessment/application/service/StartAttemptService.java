package com.nac.slogbaa.assessment.application.service;

import com.nac.slogbaa.assessment.application.dto.AttemptDto;
import com.nac.slogbaa.assessment.application.port.in.StartAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;
import com.nac.slogbaa.assessment.application.port.out.QuizStorePort;

import java.util.UUID;

public final class StartAttemptService implements StartAttemptUseCase {

    private final AttemptPort attemptPort;
    private final QuizStorePort quizStore;

    public StartAttemptService(AttemptPort attemptPort, QuizStorePort quizStore) {
        this.attemptPort = attemptPort;
        this.quizStore = quizStore;
    }

    @Override
    public AttemptDto start(UUID traineeId, UUID quizId, UUID moduleId) {
        if (quizStore.findById(quizId).isEmpty()) {
            throw new IllegalArgumentException("Quiz not found: " + quizId);
        }
        if (attemptPort.getQuizForAttempt(quizId).isEmpty()) {
            throw new IllegalStateException("Quiz has no questions");
        }
        return attemptPort.startAttempt(traineeId, quizId, moduleId);
    }
}
