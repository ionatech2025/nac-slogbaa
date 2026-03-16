package com.nac.slogbaa.assessment.application.port.in;

import com.nac.slogbaa.assessment.application.dto.QuizForAttemptDto;

import java.util.Optional;
import java.util.UUID;

/** Get quiz by module for trainee attempt (questions without correct answers). */
public interface GetQuizForAttemptUseCase {

    Optional<QuizForAttemptDto> getByModuleId(UUID moduleId);
}
