package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.application.dto.CertificateSummaryResult;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Port for certificate persistence and queries.
 */
public interface CertificateRepositoryPort {

    List<CertificateSummaryResult> findAllForAdmin();

    Page<CertificateSummaryResult> findAllForAdmin(Pageable pageable);

    Optional<CertificateData> findById(UUID id);

    boolean existsByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    void save(NewCertificateData data);

    void saveRevoked(UUID id, boolean revoked);

    /**
     * Minimal certificate data for revoke operation.
     */
    record CertificateData(UUID id, boolean revoked) {}

    /**
     * Data for creating a new certificate.
     */
    record NewCertificateData(UUID traineeId, UUID courseId, String certificateNumber,
                              java.time.LocalDate issuedDate, int finalScorePercent, String verificationCode,
                              String fileUrl) {}
}
