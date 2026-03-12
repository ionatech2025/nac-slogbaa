package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.port.in.RevokeCertificateUseCase;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort;

import java.util.UUID;

public final class RevokeCertificateService implements RevokeCertificateUseCase {

    private final CertificateRepositoryPort certificateRepository;

    public RevokeCertificateService(CertificateRepositoryPort certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    @Override
    public void revoke(UUID certificateId) {
        certificateRepository.findById(certificateId)
                .filter(c -> !c.revoked())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found or already revoked"));
        certificateRepository.saveRevoked(certificateId, true);
    }
}
