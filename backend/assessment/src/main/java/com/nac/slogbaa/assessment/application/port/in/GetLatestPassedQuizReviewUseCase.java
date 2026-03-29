package com.nac.slogbaa.assessment.application.port.in;

import com.nac.slogbaa.assessment.application.dto.SubmittedAttemptDto;

import java.util.Optional;
import java.util.UUID;

public interface GetLatestPassedQuizReviewUseCase {

    Optional<SubmittedAttemptDto> getReview(UUID traineeId, UUID courseId, UUID moduleId);
}
