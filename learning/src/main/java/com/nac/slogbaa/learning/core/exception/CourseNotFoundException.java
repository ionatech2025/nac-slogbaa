package com.nac.slogbaa.learning.core.exception;

import java.util.UUID;

/**
 * Thrown when a course is not found by id (e.g. for 404 responses).
 */
public class CourseNotFoundException extends RuntimeException {

    public CourseNotFoundException(UUID id) {
        super("Course not found: " + id);
    }
}
