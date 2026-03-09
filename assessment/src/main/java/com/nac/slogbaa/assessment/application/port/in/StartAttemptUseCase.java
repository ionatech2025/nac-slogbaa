package com.nac.slogbaa.assessment.application.port.in;

import com.nac.slogbaa.assessment.application.dto.AttemptDto;

import java.util.UUID;

public interface StartAttemptUseCase {

    /**
     * Start a new attempt for the trainee on the quiz. Creates trainee_assessment if needed.
     */
    AttemptDto start(UUID traineeId, UUID quizId, UUID moduleId);
}
