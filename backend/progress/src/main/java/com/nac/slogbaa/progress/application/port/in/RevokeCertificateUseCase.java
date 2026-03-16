package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: revoke a certificate. SuperAdmin only.
 */
public interface RevokeCertificateUseCase {

    void revoke(UUID certificateId);
}
