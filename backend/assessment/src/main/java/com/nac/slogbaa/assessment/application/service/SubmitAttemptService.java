package com.nac.slogbaa.assessment.application.service;

import com.nac.slogbaa.assessment.application.dto.SubmittedAttemptDto;
import com.nac.slogbaa.assessment.application.port.in.SubmitAttemptUseCase;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class SubmitAttemptService implements SubmitAttemptUseCase {

    private static final Duration GRACE_PERIOD = Duration.ofSeconds(30);

    private final AttemptPort attemptPort;

    public SubmitAttemptService(AttemptPort attemptPort) {
        this.attemptPort = attemptPort;
    }

    @Override
    public SubmittedAttemptDto submit(UUID attemptId, UUID traineeId, List<AttemptPort.AnswerSubmission> answers) {
        attemptPort.getAttemptTimingInfo(attemptId).ifPresent(timing -> {
            if (timing.timeLimitMinutes() != null) {
                Instant deadline = timing.startedAt()
                        .plus(Duration.ofMinutes(timing.timeLimitMinutes()))
                        .plus(GRACE_PERIOD);
                if (Instant.now().isAfter(deadline)) {
                    throw new IllegalStateException("Quiz time limit exceeded");
                }
            }
        });
        return attemptPort.submitAttempt(attemptId, traineeId, answers != null ? answers : List.of());
    }
}
