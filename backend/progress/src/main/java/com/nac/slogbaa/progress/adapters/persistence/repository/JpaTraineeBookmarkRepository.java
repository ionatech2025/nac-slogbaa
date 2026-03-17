package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeBookmarkEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaTraineeBookmarkRepository extends JpaRepository<TraineeBookmarkEntity, UUID> {

    List<TraineeBookmarkEntity> findByTraineeIdOrderByCreatedAtDesc(UUID traineeId);

    List<TraineeBookmarkEntity> findByTraineeIdAndCourseIdOrderByCreatedAtDesc(UUID traineeId, UUID courseId);

    Page<TraineeBookmarkEntity> findByTraineeIdOrderByCreatedAtDesc(UUID traineeId, Pageable pageable);

    Page<TraineeBookmarkEntity> findByTraineeIdAndCourseIdOrderByCreatedAtDesc(UUID traineeId, UUID courseId, Pageable pageable);

    Optional<TraineeBookmarkEntity> findByTraineeIdAndCourseIdAndModuleIdAndContentBlockId(
            UUID traineeId, UUID courseId, UUID moduleId, UUID contentBlockId);
}
