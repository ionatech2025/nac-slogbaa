package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;
import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.progress.adapters.persistence.entity.CourseReviewEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.CourseStaffReviewEntity;
import com.nac.slogbaa.progress.application.dto.CourseRatingSummary;
import com.nac.slogbaa.progress.application.dto.CourseReviewResult;
import com.nac.slogbaa.progress.application.port.in.GetCourseReviewsUseCase;
import com.nac.slogbaa.progress.application.port.out.CourseReviewPort;
import com.nac.slogbaa.progress.application.port.out.CourseStaffReviewPort;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.nac.slogbaa.shared.ports.GetCourseReviewSummaryPort;

/**
 * Retrieves merged trainee + staff course reviews and combined rating summary.
 */
public final class GetCourseReviewsService implements GetCourseReviewsUseCase, GetCourseReviewSummaryPort {

    private final CourseReviewPort courseReviewPort;
    private final CourseStaffReviewPort courseStaffReviewPort;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final GetStaffByIdUseCase getStaffByIdUseCase;

    public GetCourseReviewsService(CourseReviewPort courseReviewPort,
                                   CourseStaffReviewPort courseStaffReviewPort,
                                   GetTraineeByIdUseCase getTraineeByIdUseCase,
                                   GetStaffByIdUseCase getStaffByIdUseCase) {
        this.courseReviewPort = courseReviewPort;
        this.courseStaffReviewPort = courseStaffReviewPort;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.getStaffByIdUseCase = getStaffByIdUseCase;
    }

    @Override
    public List<CourseReviewResult> getReviews(UUID courseId) {
        return mergeAndSort(courseId);
    }

    @Override
    public Page<CourseReviewResult> getReviews(UUID courseId, Pageable pageable) {
        List<CourseReviewResult> merged = mergeAndSort(courseId);
        int total = merged.size();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), total);
        List<CourseReviewResult> slice = start < total ? merged.subList(start, end) : List.of();
        return new PageImpl<>(slice, pageable, total);
    }

    @Override
    public CourseRatingSummary getRatingSummary(UUID courseId) {
        long cntTrainee = courseReviewPort.getReviewCount(courseId);
        long cntStaff = courseStaffReviewPort.getReviewCount(courseId);
        long total = cntTrainee + cntStaff;
        if (total == 0) {
            return new CourseRatingSummary(0, 0);
        }
        double sum = courseReviewPort.getAverageRating(courseId) * cntTrainee
                + courseStaffReviewPort.getAverageRating(courseId) * cntStaff;
        return new CourseRatingSummary(sum / total, total);
    }

    @Override
    public ReviewSummary getSummary(UUID courseId) {
        CourseRatingSummary s = getRatingSummary(courseId);
        return new ReviewSummary(s.averageRating(), s.totalReviews());
    }

    @Override
    public void deleteReview(UUID traineeId, UUID courseId) {
        courseReviewPort.findByTraineeAndCourse(traineeId, courseId)
                .ifPresent(courseReviewPort::delete);
    }

    @Override
    public void deleteStaffReview(UUID staffUserId, UUID courseId) {
        courseStaffReviewPort.findByStaffUserAndCourse(staffUserId, courseId)
                .ifPresent(courseStaffReviewPort::delete);
    }

    private List<CourseReviewResult> mergeAndSort(UUID courseId) {
        List<CourseReviewResult> merged = new ArrayList<>();
        for (CourseReviewEntity entity : courseReviewPort.findByCourseId(courseId)) {
            merged.add(toTraineeResult(entity));
        }
        for (CourseStaffReviewEntity entity : courseStaffReviewPort.findByCourseId(courseId)) {
            merged.add(toStaffResult(entity));
        }
        merged.sort(Comparator.comparing(CourseReviewResult::createdAt).reversed());
        return merged;
    }

    private CourseReviewResult toTraineeResult(CourseReviewEntity entity) {
        String displayName = getTraineeByIdUseCase.getById(entity.getTraineeId())
                .map(GetCourseReviewsService::formatTraineePrivacyName)
                .orElse("Trainee");
        return new CourseReviewResult(
                entity.getId(),
                displayName,
                "TRAINEE",
                entity.getRating(),
                entity.getReviewText(),
                entity.getCreatedAt()
        );
    }

    private CourseReviewResult toStaffResult(CourseStaffReviewEntity entity) {
        String displayName = getStaffByIdUseCase.getById(entity.getStaffUserId())
                .map(StaffDetailsDto::getFullName)
                .orElse("Staff");
        return new CourseReviewResult(
                entity.getId(),
                displayName,
                "STAFF",
                entity.getRating(),
                entity.getReviewText(),
                entity.getCreatedAt()
        );
    }

    private static String formatTraineePrivacyName(TraineeDetails details) {
        String first = details.getFirstName();
        String last = details.getLastName();
        if (first == null || first.isBlank()) return "Trainee";
        if (last == null || last.isBlank()) return first.trim();
        return first.trim() + " " + last.trim().charAt(0) + ".";
    }
}
