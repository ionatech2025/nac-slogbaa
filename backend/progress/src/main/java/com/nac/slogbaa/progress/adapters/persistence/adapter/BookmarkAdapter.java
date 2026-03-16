package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeBookmarkEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeBookmarkRepository;
import com.nac.slogbaa.progress.application.port.out.BookmarkPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class BookmarkAdapter implements BookmarkPort {

    private final JpaTraineeBookmarkRepository jpaRepository;

    public BookmarkAdapter(JpaTraineeBookmarkRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public TraineeBookmarkEntity save(TraineeBookmarkEntity entity) {
        return jpaRepository.save(entity);
    }

    @Override
    public List<TraineeBookmarkEntity> findByTrainee(UUID traineeId) {
        return jpaRepository.findByTraineeIdOrderByCreatedAtDesc(traineeId);
    }

    @Override
    public List<TraineeBookmarkEntity> findByTraineeAndCourse(UUID traineeId, UUID courseId) {
        return jpaRepository.findByTraineeIdAndCourseIdOrderByCreatedAtDesc(traineeId, courseId);
    }

    @Override
    public Optional<TraineeBookmarkEntity> findByTraineeAndBlock(UUID traineeId, UUID courseId, UUID moduleId, UUID contentBlockId) {
        return jpaRepository.findByTraineeIdAndCourseIdAndModuleIdAndContentBlockId(traineeId, courseId, moduleId, contentBlockId);
    }

    @Override
    public Optional<TraineeBookmarkEntity> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public void delete(TraineeBookmarkEntity entity) {
        jpaRepository.delete(entity);
    }
}
