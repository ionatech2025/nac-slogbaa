package com.nac.slogbaa.assessment.application.service;

import com.nac.slogbaa.assessment.application.dto.SubmittedAttemptDto;
import com.nac.slogbaa.assessment.application.port.in.SubmitAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;

import java.util.List;
import java.util.UUID;

public final class SubmitAttemptService implements SubmitAttemptUseCase {

    private final AttemptPort attemptPort;

    public SubmitAttemptService(AttemptPort attemptPort) {
        this.attemptPort = attemptPort;
    }

    @Override
    public SubmittedAttemptDto submit(UUID attemptId, UUID traineeId, List<AttemptPort.AnswerSubmission> answers) {
        return attemptPort.submitAttempt(attemptId, traineeId, answers != null ? answers : List.of());
    }
}
