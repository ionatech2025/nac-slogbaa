package com.nac.slogbaa.shared.ports;

import java.util.UUID;

/**
 * Port for checking if a course or module can be safely deleted (no enrollments / no completions).
 * Implemented by the progress module.
 */
public interface CourseDeletionCheckPort {

    /**
     * Number of trainees enrolled in the course. Course can be deleted only when this is 0.
     */
    long countEnrollmentsByCourseId(UUID courseId);

    /**
     * Number of trainees who have completed this module. Module can be deleted only when this is 0.
     */
    long countModuleCompletionsByModuleId(UUID moduleId);
}
