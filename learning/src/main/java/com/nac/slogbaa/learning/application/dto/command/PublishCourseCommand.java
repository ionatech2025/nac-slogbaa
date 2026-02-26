package com.nac.slogbaa.learning.application.dto.command;

import java.util.Objects;
import java.util.UUID;

/**
 * Command to publish a course (make it visible to trainees).
 */
public final class PublishCourseCommand {
    private final UUID courseId;

    public PublishCourseCommand(UUID courseId) {
        this.courseId = Objects.requireNonNull(courseId);
    }

    public UUID getCourseId() { return courseId; }
}
