package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.dto.CertificateSummaryResult;
import com.nac.slogbaa.progress.application.port.in.ListCertificatesUseCase;
import com.nac.slogbaa.progress.application.port.out.CertificateRepositoryPort;

import java.util.List;

public final class ListCertificatesService implements ListCertificatesUseCase {

    private final CertificateRepositoryPort certificateRepository;

    public ListCertificatesService(CertificateRepositoryPort certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    @Override
    public List<CertificateSummaryResult> list() {
        return certificateRepository.findAllForAdmin();
    }
}
