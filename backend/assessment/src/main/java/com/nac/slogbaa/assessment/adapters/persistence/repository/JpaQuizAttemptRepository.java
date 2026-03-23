package com.nac.slogbaa.assessment.adapters.persistence.repository;

import com.nac.slogbaa.assessment.adapters.persistence.entity.QuizAttemptEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JpaQuizAttemptRepository extends JpaRepository<QuizAttemptEntity, UUID> {

    List<QuizAttemptEntity> findByTraineeAssessmentIdOrderByAttemptNumberDesc(UUID traineeAssessmentId);

    long countByTraineeAssessmentId(UUID traineeAssessmentId);

    @Query(value = """
        SELECT qa.id AS id, qa.attempt_number AS attemptNumber, qa.points_earned AS pointsEarned,
               qa.total_points AS totalPoints, qa.is_passed AS passed, qa.completed_at AS completedAt,
               ta.trainee_id AS traineeId, t.first_name || ' ' || t.last_name AS traineeName,
               q.title AS quizTitle, m.title AS moduleTitle, c.title AS courseTitle,
               m.id AS moduleId, c.id AS courseId
        FROM quiz_attempt qa
        JOIN trainee_assessment ta ON ta.id = qa.trainee_assessment_id
        JOIN trainee t ON t.id = ta.trainee_id
        JOIN quiz q ON q.id = ta.quiz_id
        JOIN module m ON m.id = ta.module_id
        JOIN course c ON c.id = m.course_id
        WHERE qa.completed_at IS NOT NULL
        ORDER BY qa.completed_at DESC
        LIMIT 500
        """, nativeQuery = true)
    List<QuizAttemptSummaryProjection> findAllCompletedForAdmin();

    @Query(value = """
        SELECT qa.id AS id, qa.attempt_number AS attemptNumber,
               qa.points_earned AS pointsEarned, qa.total_points AS totalPoints,
               qa.is_passed AS passed, qa.completed_at AS completedAt,
               ta.trainee_id AS traineeId,
               (t.first_name || ' ' || t.last_name) AS traineeName,
               q.title AS quizTitle, m.title AS moduleTitle,
               c.title AS courseTitle, m.id AS moduleId, c.id AS courseId
        FROM quiz_attempt qa
        JOIN trainee_assessment ta ON ta.id = qa.trainee_assessment_id
        JOIN trainee t ON t.id = ta.trainee_id
        JOIN quiz q ON q.id = ta.quiz_id
        JOIN module m ON m.id = ta.module_id
        JOIN course c ON c.id = m.course_id
        WHERE qa.completed_at IS NOT NULL
        """,
        countQuery = "SELECT count(*) FROM quiz_attempt WHERE completed_at IS NOT NULL",
        nativeQuery = true)
    Page<QuizAttemptSummaryProjection> findAllCompletedForAdminPaged(Pageable pageable);

    interface QuizAttemptSummaryProjection {
        UUID getId();
        int getAttemptNumber();
        int getPointsEarned();
        int getTotalPoints();
        boolean isPassed();
        java.time.Instant getCompletedAt();
        UUID getTraineeId();
        String getTraineeName();
        String getQuizTitle();
        String getModuleTitle();
        String getCourseTitle();
        UUID getModuleId();
        UUID getCourseId();
    }

    @Query(value = """
        SELECT qa.points_earned AS pointsEarned, qa.total_points AS totalPoints
        FROM quiz_attempt qa
        JOIN trainee_assessment ta ON ta.id = qa.trainee_assessment_id
        JOIN quiz q ON q.id = ta.quiz_id
        JOIN module m ON m.id = ta.module_id
        WHERE ta.trainee_id = :traineeId
        AND m.course_id = :courseId
        AND qa.is_passed = true
        AND qa.completed_at IS NOT NULL
        ORDER BY (100.0 * qa.points_earned / NULLIF(qa.total_points, 0)) DESC
        LIMIT 1
        """, nativeQuery = true)
    Optional<BestScoreProjection> findBestPassedScoreForTraineeAndCourse(
            @Param("traineeId") UUID traineeId, @Param("courseId") UUID courseId);

    @Query(value = """
            SELECT qa.id FROM quiz_attempt qa
            JOIN trainee_assessment ta ON ta.id = qa.trainee_assessment_id
            JOIN module m ON m.id = ta.module_id
            WHERE ta.trainee_id = :traineeId AND ta.module_id = :moduleId AND m.course_id = :courseId
            AND qa.completed_at IS NOT NULL AND qa.is_passed = true
            ORDER BY qa.completed_at DESC
            LIMIT 1
            """, nativeQuery = true)
    Optional<UUID> findLatestPassedAttemptId(
            @Param("traineeId") UUID traineeId,
            @Param("moduleId") UUID moduleId,
            @Param("courseId") UUID courseId);

    interface BestScoreProjection {
        int getPointsEarned();
        int getTotalPoints();
    }
}
