package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.core.aggregate.TraineeProgress;

import java.util.List;
import java.util.UUID;

/**
 * Port for trainee progress persistence.
 */
public interface TraineeProgressRepositoryPort {

    TraineeProgress save(TraineeProgress progress);

    boolean existsByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    List<TraineeProgress> findByTraineeId(UUID traineeId);
}
