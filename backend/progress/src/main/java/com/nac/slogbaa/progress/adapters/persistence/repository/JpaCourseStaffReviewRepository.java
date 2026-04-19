package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.CourseStaffReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaCourseStaffReviewRepository extends JpaRepository<CourseStaffReviewEntity, UUID> {

    List<CourseStaffReviewEntity> findByCourseIdOrderByCreatedAtDesc(UUID courseId);

    Optional<CourseStaffReviewEntity> findByStaffUserIdAndCourseId(UUID staffUserId, UUID courseId);

    @Query("SELECT COALESCE(AVG(CAST(r.rating AS double)), 0) FROM CourseStaffReviewEntity r WHERE r.courseId = :courseId")
    double averageRatingForCourse(@Param("courseId") UUID courseId);

    @Query("SELECT COALESCE(AVG(CAST(r.rating AS double)), 0) FROM CourseStaffReviewEntity r")
    double globalAverageRating();

    long countByCourseId(UUID courseId);

    @Query("SELECT r.rating, COUNT(r) FROM CourseStaffReviewEntity r GROUP BY r.rating")
    List<Object[]> countGroupedByRating();

    @Query(value = """
            SELECT CAST(date_trunc('day', created_at AT TIME ZONE 'UTC') AS date) AS d, COUNT(*)
            FROM course_staff_review
            WHERE created_at >= :since
            GROUP BY d ORDER BY d
            """, nativeQuery = true)
    List<Object[]> countCreatedPerUtcDaySince(@Param("since") java.time.Instant since);
}
