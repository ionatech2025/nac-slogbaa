package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.progress.application.port.in.CheckAndAwardBadgesUseCase;
import com.nac.slogbaa.progress.application.port.in.EnrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.core.aggregate.TraineeProgress;
import com.nac.slogbaa.progress.core.exception.AlreadyEnrolledException;
import com.nac.slogbaa.progress.core.exception.CourseNotPublishedException;
import com.nac.slogbaa.progress.core.exception.PrerequisiteNotMetException;

import java.util.Optional;
import java.util.UUID;

/**
 * Application service: enroll a trainee in a course. Validates course via Learning port.
 */
public final class EnrollTraineeService implements EnrollTraineeUseCase {

    private final CoursePublicationPort coursePublicationPort;
    private final TraineeProgressRepositoryPort traineeProgressRepository;
    private final CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase;

    public EnrollTraineeService(CoursePublicationPort coursePublicationPort,
                                TraineeProgressRepositoryPort traineeProgressRepository,
                                CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase) {
        this.coursePublicationPort = coursePublicationPort;
        this.traineeProgressRepository = traineeProgressRepository;
        this.checkAndAwardBadgesUseCase = checkAndAwardBadgesUseCase;
    }

    @Override
    public void enroll(UUID traineeId, UUID courseId) {
        if (!coursePublicationPort.isPublished(courseId)) {
            throw new CourseNotPublishedException(courseId);
        }

        // Check prerequisite: if the course has one, the trainee must have completed it
        Optional<UUID> prerequisiteId = coursePublicationPort.getPrerequisiteCourseId(courseId);
        if (prerequisiteId.isPresent()) {
            boolean completed = traineeProgressRepository.hasCompletedCourse(traineeId, prerequisiteId.get());
            if (!completed) {
                String prereqTitle = coursePublicationPort.getCourseTitle(prerequisiteId.get())
                        .orElse("the prerequisite course");
                throw new PrerequisiteNotMetException(prereqTitle);
            }
        }

        if (traineeProgressRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            throw new AlreadyEnrolledException(traineeId, courseId);
        }

        // Check for a previously withdrawn enrollment — reactivate it instead of creating a duplicate
        boolean reactivated = traineeProgressRepository.reactivateIfWithdrawn(traineeId, courseId);
        if (!reactivated) {
            TraineeProgress progress = TraineeProgress.newEnrollment(traineeId, courseId);
            traineeProgressRepository.save(progress);
        }

        try {
            checkAndAwardBadgesUseCase.checkAndAward(traineeId, "FIRST_ENROLLMENT");
        } catch (Exception ignored) {
            // Badge checks must never break the main enrollment flow
        }
    }
}
