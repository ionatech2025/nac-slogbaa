package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.progress.adapters.persistence.entity.CourseReviewEntity;
import com.nac.slogbaa.progress.application.dto.CourseRatingSummary;
import com.nac.slogbaa.progress.application.dto.CourseReviewResult;
import com.nac.slogbaa.progress.application.port.in.GetCourseReviewsUseCase;
import com.nac.slogbaa.progress.application.port.out.CourseReviewPort;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Application service: retrieve course reviews and rating summary.
 * Uses GetTraineeByIdUseCase to resolve trainee display names.
 */
public final class GetCourseReviewsService implements GetCourseReviewsUseCase {

    private final CourseReviewPort courseReviewPort;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;

    public GetCourseReviewsService(CourseReviewPort courseReviewPort,
                                   GetTraineeByIdUseCase getTraineeByIdUseCase) {
        this.courseReviewPort = courseReviewPort;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
    }

    @Override
    public List<CourseReviewResult> getReviews(UUID courseId) {
        return courseReviewPort.findByCourseId(courseId).stream()
                .map(this::toResult)
                .toList();
    }

    @Override
    public Page<CourseReviewResult> getReviews(UUID courseId, Pageable pageable) {
        return courseReviewPort.findByCourseId(courseId, pageable)
                .map(this::toResult);
    }

    @Override
    public CourseRatingSummary getRatingSummary(UUID courseId) {
        double avg = courseReviewPort.getAverageRating(courseId);
        long count = courseReviewPort.getReviewCount(courseId);
        return new CourseRatingSummary(avg, count);
    }

    @Override
    public void deleteReview(UUID traineeId, UUID courseId) {
        courseReviewPort.findByTraineeAndCourse(traineeId, courseId)
                .ifPresent(courseReviewPort::delete);
    }

    private CourseReviewResult toResult(CourseReviewEntity entity) {
        String displayName = getTraineeByIdUseCase.getById(entity.getTraineeId())
                .map(GetCourseReviewsService::formatDisplayName)
                .orElse("Trainee");
        return new CourseReviewResult(
                entity.getId(),
                displayName,
                entity.getRating(),
                entity.getReviewText(),
                entity.getCreatedAt()
        );
    }

    /** Format as "First L." for privacy (first name + last initial). */
    private static String formatDisplayName(TraineeDetails details) {
        String first = details.getFirstName();
        String last = details.getLastName();
        if (first == null || first.isBlank()) return "Trainee";
        if (last == null || last.isBlank()) return first.trim();
        return first.trim() + " " + last.trim().charAt(0) + ".";
    }
}
