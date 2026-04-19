package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.CourseReviewEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface JpaCourseReviewRepository extends JpaRepository<CourseReviewEntity, UUID> {

    List<CourseReviewEntity> findByCourseIdOrderByCreatedAtDesc(UUID courseId);

    Page<CourseReviewEntity> findByCourseIdOrderByCreatedAtDesc(UUID courseId, Pageable pageable);

    Optional<CourseReviewEntity> findByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    @Query("SELECT COALESCE(AVG(CAST(r.rating AS double)), 0) FROM CourseReviewEntity r WHERE r.courseId = :courseId")
    double averageRatingByCourseId(UUID courseId);

    @Query("SELECT COALESCE(AVG(CAST(r.rating AS double)), 0) FROM CourseReviewEntity r")
    double globalAverageRating();

    long countByCourseId(UUID courseId);

    List<CourseReviewEntity> findByTraineeIdOrderByCreatedAtDesc(UUID traineeId);

    @Query("SELECT r.rating, COUNT(r) FROM CourseReviewEntity r GROUP BY r.rating")
    List<Object[]> countGroupedByRating();

    @Query(value = """
            SELECT CAST(date_trunc('day', created_at AT TIME ZONE 'UTC') AS date) AS d, COUNT(*)
            FROM course_review
            WHERE created_at >= :since
            GROUP BY d ORDER BY d
            """, nativeQuery = true)
    List<Object[]> countCreatedPerUtcDaySince(@Param("since") Instant since);
}
