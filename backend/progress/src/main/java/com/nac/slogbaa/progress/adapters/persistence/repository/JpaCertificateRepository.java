package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.CertificateEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface JpaCertificateRepository extends JpaRepository<CertificateEntity, UUID> {

    Optional<CertificateEntity> findById(UUID id);

    boolean existsByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    List<CertificateEntity> findByTraineeIdAndRevokedFalseOrderByIssuedDateDesc(UUID traineeId);

    @Query(value = """
        SELECT c.id AS id, c.course_id AS courseId, co.title AS courseTitle, c.certificate_number AS certificateNumber,
               c.issued_date AS issuedDate, c.final_score_percent AS finalScorePercent, c.file_url AS fileUrl
        FROM certificate c
        JOIN course co ON co.id = c.course_id
        WHERE c.trainee_id = :traineeId AND c.is_revoked = false
        ORDER BY c.issued_date DESC
        """, nativeQuery = true)
    List<TraineeCertificateProjection> findTraineeCertificatesWithCourse(@Param("traineeId") UUID traineeId);

    interface TraineeCertificateProjection {
        UUID getId();
        UUID getCourseId();
        String getCourseTitle();
        String getCertificateNumber();
        java.time.LocalDate getIssuedDate();
        int getFinalScorePercent();
        String getFileUrl();
    }

    @Query(value = """
        SELECT c.id AS id, c.trainee_id AS traineeId, c.course_id AS courseId,
               c.certificate_number AS certificateNumber, c.issued_date AS issuedDate,
               c.final_score_percent AS finalScorePercent, c.is_revoked AS revoked,
               (t.first_name || ' ' || t.last_name) AS traineeName,
               co.title AS courseTitle
        FROM certificate c
        JOIN trainee t ON t.id = c.trainee_id
        JOIN course co ON co.id = c.course_id
        ORDER BY c.issued_date DESC
        """, nativeQuery = true)
    java.util.List<CertificateSummaryProjection> findAllWithTraineeAndCourse();

    interface CertificateSummaryProjection {
        UUID getId();
        UUID getTraineeId();
        UUID getCourseId();
        String getCertificateNumber();
        java.time.LocalDate getIssuedDate();
        int getFinalScorePercent();
        boolean isRevoked();
        String getTraineeName();
        String getCourseTitle();
    }

    @Query(value = """
        SELECT c.id AS id, c.trainee_id AS traineeId, c.course_id AS courseId,
               c.certificate_number AS certificateNumber, c.issued_date AS issuedDate,
               c.final_score_percent AS finalScorePercent, c.is_revoked AS revoked,
               (t.first_name || ' ' || t.last_name) AS traineeName,
               co.title AS courseTitle
        FROM certificate c
        JOIN trainee t ON t.id = c.trainee_id
        JOIN course co ON co.id = c.course_id
        """,
        countQuery = "SELECT count(*) FROM certificate",
        nativeQuery = true)
    Page<CertificateSummaryProjection> findAllWithTraineeAndCoursePaged(Pageable pageable);
}
