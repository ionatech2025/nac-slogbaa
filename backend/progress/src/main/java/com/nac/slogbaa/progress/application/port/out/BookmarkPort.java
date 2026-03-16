package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeBookmarkEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port for trainee bookmark persistence.
 */
public interface BookmarkPort {

    TraineeBookmarkEntity save(TraineeBookmarkEntity entity);

    List<TraineeBookmarkEntity> findByTrainee(UUID traineeId);

    List<TraineeBookmarkEntity> findByTraineeAndCourse(UUID traineeId, UUID courseId);

    Optional<TraineeBookmarkEntity> findByTraineeAndBlock(UUID traineeId, UUID courseId, UUID moduleId, UUID contentBlockId);

    Optional<TraineeBookmarkEntity> findById(UUID id);

    void delete(TraineeBookmarkEntity entity);
}
