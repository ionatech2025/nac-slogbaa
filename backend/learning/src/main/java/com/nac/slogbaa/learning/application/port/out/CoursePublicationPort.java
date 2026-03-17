package com.nac.slogbaa.learning.application.port.out;

import java.util.Optional;
import java.util.UUID;

/**
 * Port for checking if a course exists and is published. Used by Progress module for enrollment validation.
 */
public interface CoursePublicationPort {

    /**
     * @return true if the course exists and is published, false otherwise
     */
    boolean isPublished(UUID courseId);

    /**
     * @return the prerequisite course ID for the given course, or empty if none
     */
    Optional<UUID> getPrerequisiteCourseId(UUID courseId);

    /**
     * @return the title of the given course, or empty if not found
     */
    Optional<String> getCourseTitle(UUID courseId);
}
