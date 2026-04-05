package com.nac.slogbaa.shared.ports;

import java.util.List;
import java.util.UUID;

/**
 * Port to query trainee enrollments from other modules.
 */
public interface TraineeEnrollmentQueryPort {

    /**
     * Get IDs of courses the trainee is currently enrolled in.
     */
    List<UUID> getEnrolledCourseIds(UUID traineeId);
}
