package com.nac.slogbaa.assessment.application.dto;

import java.util.List;
import java.util.UUID;

/** Question for attempt: options without isCorrect. */
public record QuestionForAttemptDto(
        UUID id,
        String questionText,
        String questionType,
        int points,
        int questionOrder,
        List<OptionForAttemptDto> options
) {
    public QuestionForAttemptDto {
        options = options != null ? List.copyOf(options) : List.of();
    }
}
