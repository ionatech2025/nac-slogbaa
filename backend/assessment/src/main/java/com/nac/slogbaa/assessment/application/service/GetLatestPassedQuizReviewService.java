package com.nac.slogbaa.assessment.application.service;

import com.nac.slogbaa.assessment.application.dto.SubmittedAttemptDto;
import com.nac.slogbaa.assessment.application.port.in.GetLatestPassedQuizReviewUseCase;
import com.nac.slogbaa.assessment.application.port.out.AttemptPort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class GetLatestPassedQuizReviewService implements GetLatestPassedQuizReviewUseCase {

    private final AttemptPort attemptPort;

    public GetLatestPassedQuizReviewService(AttemptPort attemptPort) {
        this.attemptPort = attemptPort;
    }

    @Override
    public Optional<SubmittedAttemptDto> getReview(UUID traineeId, UUID courseId, UUID moduleId) {
        return attemptPort.findLatestPassedAttemptReview(traineeId, moduleId, courseId);
    }
}
