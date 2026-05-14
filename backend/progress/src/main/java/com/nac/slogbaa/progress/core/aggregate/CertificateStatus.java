package com.nac.slogbaa.progress.core.aggregate;

/**
 * Represents the lifecycle status of a certificate.
 */
public enum CertificateStatus {
    /**
     * Certificate is issued and valid.
     */
    ISSUED,

    /**
     * Certificate has been revoked due to academic dishonesty or other reasons.
     */
    REVOKED,

    /**
     * Certificate is no longer active (if the course has a periodic expiration).
     */
    EXPIRED
}
