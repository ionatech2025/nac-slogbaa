package com.nac.slogbaa.progress.application.port.out;

import java.util.UUID;

/**
 * Port for recording module completion and querying completion counts.
 * Course is complete when all modules are completed for that trainee/course.
 */
public interface ModuleCompletionPort {

    /**
     * Record that the given module is completed for the trainee's progress on the course.
     * Idempotent: if already completed, no-op.
     */
    void recordModuleCompleted(UUID traineeId, UUID courseId, UUID moduleId);

    /**
     * Count how many modules are in COMPLETED status for this trainee's course progress.
     * Returns 0 if not enrolled.
     */
    long countCompletedModules(UUID traineeId, UUID courseId);
}
