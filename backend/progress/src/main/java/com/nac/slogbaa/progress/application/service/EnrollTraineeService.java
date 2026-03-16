package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.progress.application.port.in.EnrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.core.aggregate.TraineeProgress;
import com.nac.slogbaa.progress.core.exception.AlreadyEnrolledException;
import com.nac.slogbaa.progress.core.exception.CourseNotPublishedException;

import java.util.UUID;

/**
 * Application service: enroll a trainee in a course. Validates course via Learning port.
 */
public final class EnrollTraineeService implements EnrollTraineeUseCase {

    private final CoursePublicationPort coursePublicationPort;
    private final TraineeProgressRepositoryPort traineeProgressRepository;

    public EnrollTraineeService(CoursePublicationPort coursePublicationPort,
                                TraineeProgressRepositoryPort traineeProgressRepository) {
        this.coursePublicationPort = coursePublicationPort;
        this.traineeProgressRepository = traineeProgressRepository;
    }

    @Override
    public void enroll(UUID traineeId, UUID courseId) {
        if (!coursePublicationPort.isPublished(courseId)) {
            throw new CourseNotPublishedException(courseId);
        }
        if (traineeProgressRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            throw new AlreadyEnrolledException(traineeId, courseId);
        }
        TraineeProgress progress = TraineeProgress.newEnrollment(traineeId, courseId);
        traineeProgressRepository.save(progress);
    }
}
