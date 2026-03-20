package com.nac.slogbaa.service;

import com.nac.slogbaa.iam.application.dto.result.TraineeDataExportResult;
import com.nac.slogbaa.iam.application.dto.result.TraineeDataExportResult.BookmarkData;
import com.nac.slogbaa.iam.application.dto.result.TraineeDataExportResult.EnrollmentData;
import com.nac.slogbaa.iam.application.dto.result.TraineeDataExportResult.ProfileData;
import com.nac.slogbaa.iam.application.dto.result.TraineeDataExportResult.ReviewData;
import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.ExportTraineeDataUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.iam.core.exception.TraineeNotFoundException;
import com.nac.slogbaa.progress.application.dto.BookmarkResult;
import com.nac.slogbaa.progress.application.dto.EnrolledCourseResult;
import com.nac.slogbaa.progress.application.port.in.GetBookmarksUseCase;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.out.CourseReviewPort;
import com.nac.slogbaa.progress.adapters.persistence.entity.CourseReviewEntity;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Cross-module service: exports all trainee data for GDPR data portability.
 * Lives in the app module because it aggregates data from IAM and Progress modules.
 */
public final class ExportTraineeDataService implements ExportTraineeDataUseCase {

    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final GetEnrolledCoursesUseCase getEnrolledCoursesUseCase;
    private final GetBookmarksUseCase getBookmarksUseCase;
    private final CourseReviewPort courseReviewPort;

    public ExportTraineeDataService(GetTraineeByIdUseCase getTraineeByIdUseCase,
                                    GetEnrolledCoursesUseCase getEnrolledCoursesUseCase,
                                    GetBookmarksUseCase getBookmarksUseCase,
                                    CourseReviewPort courseReviewPort) {
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.getEnrolledCoursesUseCase = getEnrolledCoursesUseCase;
        this.getBookmarksUseCase = getBookmarksUseCase;
        this.courseReviewPort = courseReviewPort;
    }

    @Override
    public TraineeDataExportResult export(UUID traineeId) {
        TraineeDetails details = getTraineeByIdUseCase.getById(traineeId)
                .orElseThrow(() -> new TraineeNotFoundException(traineeId));

        ProfileData profile = new ProfileData(
                details.getId(),
                details.getEmail(),
                details.getFirstName(),
                details.getLastName(),
                details.getGender(),
                details.getDistrictName(),
                details.getRegion(),
                details.getCategory(),
                details.getStreet(),
                details.getCity(),
                details.getPostalCode(),
                details.getPhoneCountryCode(),
                details.getPhoneNationalNumber()
        );

        List<EnrolledCourseResult> enrolled = getEnrolledCoursesUseCase.getEnrolledCourses(traineeId);
        List<EnrollmentData> enrollments = enrolled.stream()
                .map(e -> new EnrollmentData(e.id(), e.title(), e.description(), e.completionPercentage()))
                .toList();

        List<BookmarkResult> bookmarkResults = getBookmarksUseCase.getBookmarks(traineeId, null);
        List<BookmarkData> bookmarks = bookmarkResults.stream()
                .map(b -> new BookmarkData(b.id(), b.courseId(), b.courseTitle(),
                        b.moduleId(), b.moduleTitle(), b.contentBlockId(), b.note(), b.createdAt()))
                .toList();

        List<CourseReviewEntity> reviewEntities = courseReviewPort.findByTraineeId(traineeId);
        List<ReviewData> reviews = reviewEntities.stream()
                .map(r -> new ReviewData(r.getId(), r.getCourseId(), r.getRating(),
                        r.getReviewText(), r.getCreatedAt()))
                .toList();

        return new TraineeDataExportResult(Instant.now(), profile, enrollments, bookmarks, reviews);
    }
}
