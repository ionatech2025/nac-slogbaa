package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.CertificateSummaryResult;

import java.util.List;

/**
 * Use case: list all certificates for admin view.
 */
public interface ListCertificatesUseCase {

    List<CertificateSummaryResult> list();
}
