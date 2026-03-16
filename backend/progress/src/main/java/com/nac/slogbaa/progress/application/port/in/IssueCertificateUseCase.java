package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: issue a certificate when a trainee completes a course.
 * Generates PDF, stores it, optionally sends by email.
 */
public interface IssueCertificateUseCase {

    /**
     * Issue certificate if eligible (course complete, no existing certificate).
     * Idempotent: if certificate already exists, no-op.
     */
    void issueIfEligible(UUID traineeId, UUID courseId);
}
