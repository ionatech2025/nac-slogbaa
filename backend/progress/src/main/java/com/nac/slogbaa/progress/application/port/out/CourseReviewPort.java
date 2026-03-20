package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.adapters.persistence.entity.CourseReviewEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Port for course review persistence.
 */
public interface CourseReviewPort {

    CourseReviewEntity save(CourseReviewEntity entity);

    List<CourseReviewEntity> findByCourseId(UUID courseId);

    Page<CourseReviewEntity> findByCourseId(UUID courseId, Pageable pageable);

    Optional<CourseReviewEntity> findByTraineeAndCourse(UUID traineeId, UUID courseId);

    double getAverageRating(UUID courseId);

    long getReviewCount(UUID courseId);

    void delete(CourseReviewEntity entity);

    List<CourseReviewEntity> findByTraineeId(UUID traineeId);
}
