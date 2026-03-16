package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.adapters.persistence.entity.CourseReviewEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port for course review persistence.
 */
public interface CourseReviewPort {

    CourseReviewEntity save(CourseReviewEntity entity);

    List<CourseReviewEntity> findByCourseId(UUID courseId);

    Optional<CourseReviewEntity> findByTraineeAndCourse(UUID traineeId, UUID courseId);

    double getAverageRating(UUID courseId);

    long getReviewCount(UUID courseId);

    void delete(CourseReviewEntity entity);
}
