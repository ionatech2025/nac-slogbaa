package com.nac.slogbaa.learning.application.port.out;

import java.util.UUID;

/**
 * Port for checking if a course exists and is published. Used by Progress module for enrollment validation.
 */
public interface CoursePublicationPort {

    /**
     * @return true if the course exists and is published, false otherwise
     */
    boolean isPublished(UUID courseId);
}
