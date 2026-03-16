package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.CertificateEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaCertificateRepository;
import com.nac.slogbaa.progress.application.dto.CertificateSummaryResult;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort.NewCertificateData;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CertificateRepositoryAdapter implements CertificateRepositoryPort {

    private final JpaCertificateRepository jpaRepository;

    public CertificateRepositoryAdapter(JpaCertificateRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<CertificateSummaryResult> findAllForAdmin() {
        return jpaRepository.findAllWithTraineeAndCourse().stream()
                .map(p -> new CertificateSummaryResult(
                        p.getId(),
                        p.getTraineeId(),
                        p.getCourseId(),
                        p.getCertificateNumber(),
                        p.getIssuedDate(),
                        p.getFinalScorePercent(),
                        p.isRevoked(),
                        p.getTraineeName(),
                        p.getCourseTitle()
                ))
                .toList();
    }

    @Override
    public Optional<CertificateData> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(e -> new CertificateData(e.getId(), e.isRevoked()));
    }

    @Override
    public boolean existsByTraineeIdAndCourseId(UUID traineeId, UUID courseId) {
        return jpaRepository.existsByTraineeIdAndCourseId(traineeId, courseId);
    }

    @Override
    public void save(NewCertificateData data) {
        CertificateEntity entity = new CertificateEntity();
        entity.setId(UUID.randomUUID());
        entity.setTraineeId(data.traineeId());
        entity.setCourseId(data.courseId());
        entity.setCertificateNumber(data.certificateNumber());
        entity.setIssuedDate(data.issuedDate());
        entity.setFinalScorePercent(data.finalScorePercent());
        entity.setVerificationCode(data.verificationCode());
        entity.setFileUrl(data.fileUrl());
        entity.setRevoked(false);
        entity.setCertificateTemplateVersion("v1");
        entity.setLayoutType("STANDARD");
        jpaRepository.save(entity);
    }

    @Override
    public void saveRevoked(UUID id, boolean revoked) {
        jpaRepository.findById(id).ifPresent(entity -> {
            entity.setRevoked(revoked);
            jpaRepository.save(entity);
        });
    }
}
