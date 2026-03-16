package com.nac.slogbaa.assessment.application.dto;

import java.time.Instant;
import java.util.UUID;

/** Result of starting an attempt. */
public record AttemptDto(
        UUID attemptId,
        UUID traineeAssessmentId,
        int attemptNumber,
        Instant startedAt,
        QuizForAttemptDto quiz
) {}
