package com.nac.slogbaa.progress.core.aggregate;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

/**
 * Domain aggregate for a trainee's progress in a course (enrollment record).
 */
public final class TraineeProgress {

    private final UUID id;
    private final UUID traineeId;
    private final UUID courseId;
    private final LocalDate enrollmentDate;
    private final String status;
    private final int completionPercentage;

    public TraineeProgress(UUID id, UUID traineeId, UUID courseId,
                           LocalDate enrollmentDate, String status, int completionPercentage) {
        this.id = Objects.requireNonNull(id);
        this.traineeId = Objects.requireNonNull(traineeId);
        this.courseId = Objects.requireNonNull(courseId);
        this.enrollmentDate = Objects.requireNonNull(enrollmentDate);
        this.status = Objects.requireNonNull(status);
        this.completionPercentage = completionPercentage >= 0 && completionPercentage <= 100
                ? completionPercentage
                : 0;
    }

    public static TraineeProgress newEnrollment(UUID traineeId, UUID courseId) {
        return new TraineeProgress(
                UUID.randomUUID(),
                traineeId,
                courseId,
                LocalDate.now(),
                "IN_PROGRESS",
                0
        );
    }

    public UUID getId() {
        return id;
    }

    public UUID getTraineeId() {
        return traineeId;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public String getStatus() {
        return status;
    }

    public int getCompletionPercentage() {
        return completionPercentage;
    }
}
