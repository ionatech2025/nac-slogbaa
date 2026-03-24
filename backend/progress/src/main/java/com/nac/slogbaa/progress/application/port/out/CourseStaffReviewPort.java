package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.adapters.persistence.entity.CourseStaffReviewEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseStaffReviewPort {

    CourseStaffReviewEntity save(CourseStaffReviewEntity entity);

    List<CourseStaffReviewEntity> findByCourseId(UUID courseId);

    Optional<CourseStaffReviewEntity> findByStaffUserAndCourse(UUID staffUserId, UUID courseId);

    void delete(CourseStaffReviewEntity entity);

    double getAverageRating(UUID courseId);

    long getReviewCount(UUID courseId);

    List<Object[]> countGroupedByRating();

    List<Object[]> countCreatedPerUtcDaySince(java.time.Instant since);

    long countAll();
}
