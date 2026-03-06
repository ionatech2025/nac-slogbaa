package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Records that a trainee has completed a module. Updates course completion:
 * course is complete when all modules are completed.
 */
public interface RecordModuleCompletionUseCase {

    /**
     * Record module as completed for the trainee on the course. Idempotent.
     * If all modules are now completed, marks the course as COMPLETED.
     */
    void record(UUID traineeId, UUID courseId, UUID moduleId);
}
