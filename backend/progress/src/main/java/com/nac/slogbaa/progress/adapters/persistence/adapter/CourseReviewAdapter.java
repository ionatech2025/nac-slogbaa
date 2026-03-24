package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.CourseReviewEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCourseReviewRepository;
import com.nac.slogbaa.progress.application.port.out.CourseReviewPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CourseReviewAdapter implements CourseReviewPort {

    private final JpaCourseReviewRepository jpaRepository;

    public CourseReviewAdapter(JpaCourseReviewRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public CourseReviewEntity save(CourseReviewEntity entity) {
        return jpaRepository.save(entity);
    }

    @Override
    public List<CourseReviewEntity> findByCourseId(UUID courseId) {
        return jpaRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }

    @Override
    public Page<CourseReviewEntity> findByCourseId(UUID courseId, Pageable pageable) {
        return jpaRepository.findByCourseIdOrderByCreatedAtDesc(courseId, pageable);
    }

    @Override
    public Optional<CourseReviewEntity> findByTraineeAndCourse(UUID traineeId, UUID courseId) {
        return jpaRepository.findByTraineeIdAndCourseId(traineeId, courseId);
    }

    @Override
    public double getAverageRating(UUID courseId) {
        return jpaRepository.averageRatingByCourseId(courseId);
    }

    @Override
    public long getReviewCount(UUID courseId) {
        return jpaRepository.countByCourseId(courseId);
    }

    @Override
    public void delete(CourseReviewEntity entity) {
        jpaRepository.delete(entity);
    }

    @Override
    public List<CourseReviewEntity> findByTraineeId(UUID traineeId) {
        return jpaRepository.findByTraineeIdOrderByCreatedAtDesc(traineeId);
    }

    @Override
    public List<Object[]> countGroupedByRating() {
        return jpaRepository.countGroupedByRating();
    }

    @Override
    public List<Object[]> countCreatedPerUtcDaySince(Instant since) {
        return jpaRepository.countCreatedPerUtcDaySince(since);
    }

    @Override
    public long countAll() {
        return jpaRepository.count();
    }
}
