package com.nac.slogbaa.assessment.application.dto;

import java.util.List;
import java.util.UUID;

/**
 * Quiz info for starting an attempt: questions and options without correct answers.
 */
public record QuizForAttemptDto(
        UUID quizId,
        UUID moduleId,
        String title,
        int passThresholdPercent,
        Integer maxAttempts,
        Integer timeLimitMinutes,
        List<QuestionForAttemptDto> questions
) {
    public QuizForAttemptDto {
        questions = questions != null ? List.copyOf(questions) : List.of();
    }
}
