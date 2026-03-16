package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.dto.ResumePoint;
import com.nac.slogbaa.progress.application.port.in.GetResumePointUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;

import java.util.Optional;
import java.util.UUID;

/**
 * Returns trainee's resume point for a course.
 */
public final class GetResumePointService implements GetResumePointUseCase {

    private final TraineeProgressRepositoryPort traineeProgressRepository;

    public GetResumePointService(TraineeProgressRepositoryPort traineeProgressRepository) {
        this.traineeProgressRepository = traineeProgressRepository;
    }

    @Override
    public Optional<ResumePoint> getResumePoint(UUID traineeId, UUID courseId) {
        return traineeProgressRepository.findResumePoint(traineeId, courseId);
    }
}
