package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.CertificateSummaryResult;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Use case: list all certificates for admin view.
 */
public interface ListCertificatesUseCase {

    List<CertificateSummaryResult> list();

    Page<CertificateSummaryResult> list(Pageable pageable);
}
