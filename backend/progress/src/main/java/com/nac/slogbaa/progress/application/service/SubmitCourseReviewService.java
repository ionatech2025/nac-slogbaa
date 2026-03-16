package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.adapters.persistence.entity.CourseReviewEntity;
import com.nac.slogbaa.progress.application.port.in.SubmitCourseReviewUseCase;
import com.nac.slogbaa.progress.application.port.out.CourseReviewPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;

import java.util.UUID;

/**
 * Application service: submit a course review. Validates trainee is enrolled.
 */
public final class SubmitCourseReviewService implements SubmitCourseReviewUseCase {

    private final CourseReviewPort courseReviewPort;
    private final TraineeProgressRepositoryPort traineeProgressRepository;

    public SubmitCourseReviewService(CourseReviewPort courseReviewPort,
                                     TraineeProgressRepositoryPort traineeProgressRepository) {
        this.courseReviewPort = courseReviewPort;
        this.traineeProgressRepository = traineeProgressRepository;
    }

    @Override
    public void submit(UUID traineeId, UUID courseId, int rating, String reviewText) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (!traineeProgressRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            throw new IllegalStateException("Trainee must be enrolled in the course to submit a review");
        }

        // Upsert: update existing review or create new one
        CourseReviewEntity entity = courseReviewPort.findByTraineeAndCourse(traineeId, courseId)
                .orElseGet(() -> {
                    CourseReviewEntity e = new CourseReviewEntity();
                    e.setTraineeId(traineeId);
                    e.setCourseId(courseId);
                    return e;
                });
        entity.setRating((short) rating);
        entity.setReviewText(reviewText);
        courseReviewPort.save(entity);
    }
}
