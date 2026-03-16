package com.nac.slogbaa.progress.core.exception;

import java.util.UUID;

/**
 * Thrown when a trainee is already enrolled in a course.
 */
public final class AlreadyEnrolledException extends RuntimeException {

    private final UUID traineeId;
    private final UUID courseId;

    public AlreadyEnrolledException(UUID traineeId, UUID courseId) {
        super("Trainee already enrolled in course: traineeId=" + traineeId + ", courseId=" + courseId);
        this.traineeId = traineeId;
        this.courseId = courseId;
    }

    public UUID getTraineeId() {
        return traineeId;
    }

    public UUID getCourseId() {
        return courseId;
    }
}
