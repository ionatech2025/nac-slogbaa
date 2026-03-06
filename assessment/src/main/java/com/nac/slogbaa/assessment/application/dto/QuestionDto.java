package com.nac.slogbaa.assessment.application.dto;

import java.util.List;
import java.util.UUID;

public record QuestionDto(
        UUID id,
        UUID quizId,
        String questionText,
        String questionType,
        int points,
        int questionOrder,
        List<OptionDto> options
) {
    public QuestionDto {
        options = options != null ? List.copyOf(options) : List.of();
    }
}
