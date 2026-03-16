package com.nac.slogbaa.assessment.application.dto;

import java.util.UUID;

public record OptionDto(
        UUID id,
        UUID questionId,
        String optionText,
        boolean correct,
        int optionOrder
) {}
