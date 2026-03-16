package com.nac.slogbaa.progress.core.exception;

import java.util.UUID;

/**
 * Thrown when enrollment is attempted for a course that does not exist or is not published.
 */
public final class CourseNotPublishedException extends RuntimeException {

    private final UUID courseId;

    public CourseNotPublishedException(UUID courseId) {
        super("Course not found or not published: courseId=" + courseId);
        this.courseId = courseId;
    }

    public UUID getCourseId() {
        return courseId;
    }
}
