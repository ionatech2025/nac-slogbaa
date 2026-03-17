package com.nac.slogbaa.assessment.application.dto;

import java.util.UUID;

/** Detail of a single answer within a submitted attempt (for review). */
public record SubmittedAnswerDto(
        UUID questionId,
        String questionText,
        UUID selectedOptionId,
        String selectedOptionText,
        UUID correctOptionId,
        String correctOptionText,
        boolean correct,
        int pointsAwarded,
        int totalPoints
) {}
