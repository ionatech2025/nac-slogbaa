package com.nac.slogbaa.learning.core.exception;

import java.util.UUID;

/**
 * Thrown when a course cannot be deleted because it has at least one enrolled trainee.
 */
public class CourseHasEnrollmentsException extends RuntimeException {

    public CourseHasEnrollmentsException(UUID courseId, long enrollmentCount) {
        super("Course cannot be deleted: " + enrollmentCount + " trainee(s) enrolled. Course id: " + courseId);
    }
}
