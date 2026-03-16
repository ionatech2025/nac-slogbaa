package com.nac.slogbaa.assessment.application.dto;

import java.util.List;
import java.util.UUID;

/**
 * Quiz with questions and options for CRUD and read.
 */
public record QuizDto(
        UUID id,
        UUID moduleId,
        String title,
        int passThresholdPercent,
        Integer maxAttempts,
        Integer timeLimitMinutes,
        List<QuestionDto> questions
) {
    public QuizDto {
        questions = questions != null ? List.copyOf(questions) : List.of();
    }
}
