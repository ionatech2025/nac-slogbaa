package com.nac.slogbaa.learning.application.dto.command;

import java.util.UUID;

/**
 * Command to unpublish a course (make it no longer visible to trainees).
 */
public final class UnpublishCourseCommand {

    private final UUID courseId;

    public UnpublishCourseCommand(UUID courseId) {
        this.courseId = courseId;
    }

    public UUID getCourseId() {
        return courseId;
    }
}
