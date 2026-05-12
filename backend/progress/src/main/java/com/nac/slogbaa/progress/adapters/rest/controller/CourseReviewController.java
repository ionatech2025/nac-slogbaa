package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.CourseRatingSummary;
import com.nac.slogbaa.progress.application.dto.CourseReviewResult;
import com.nac.slogbaa.progress.application.port.in.GetCourseReviewsUseCase;
import com.nac.slogbaa.progress.application.port.in.SubmitCourseReviewUseCase;
import com.nac.slogbaa.progress.application.port.in.SubmitStaffCourseReviewUseCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import com.nac.slogbaa.shared.events.SystemActivityEvent;

/**
 * REST controller for course reviews and ratings.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseReviewController {

    private final SubmitCourseReviewUseCase submitCourseReviewUseCase;
    private final SubmitStaffCourseReviewUseCase submitStaffCourseReviewUseCase;
    private final GetCourseReviewsUseCase getCourseReviewsUseCase;
    private final ApplicationEventPublisher eventPublisher;

    public CourseReviewController(SubmitCourseReviewUseCase submitCourseReviewUseCase,
                                  SubmitStaffCourseReviewUseCase submitStaffCourseReviewUseCase,
                                  GetCourseReviewsUseCase getCourseReviewsUseCase,
                                  ApplicationEventPublisher eventPublisher) {
        this.submitCourseReviewUseCase = submitCourseReviewUseCase;
        this.submitStaffCourseReviewUseCase = submitStaffCourseReviewUseCase;
        this.getCourseReviewsUseCase = getCourseReviewsUseCase;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/{courseId}/reviews")
    @PreAuthorize("hasAnyRole('TRAINEE','ADMIN')")
    public ResponseEntity<Void> submitReview(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @RequestBody SubmitReviewRequest request) {
        if (identity.isStaff()) {
            submitStaffCourseReviewUseCase.submit(
                    identity.getUserId(),
                    courseId,
                    request.rating(),
                    request.reviewText()
            );
        } else {
            submitCourseReviewUseCase.submit(
                    identity.getUserId(),
                    courseId,
                    request.rating(),
                    request.reviewText()
            );
        }
        eventPublisher.publishEvent(new SystemActivityEvent(
                identity.getUserId(),
                identity.getRole().name(),
                "CREATE",
                courseId.toString(),
                "Submitted course review (Rating: " + request.rating() + ")"
        ));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{courseId}/reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<CourseReviewResult>> getReviews(
            @PathVariable UUID courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        Page<CourseReviewResult> result = getCourseReviewsUseCase.getReviews(courseId, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{courseId}/rating")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CourseRatingSummary> getRating(
            @PathVariable UUID courseId) {
        return ResponseEntity.ok(getCourseReviewsUseCase.getRatingSummary(courseId));
    }

    @DeleteMapping("/{courseId}/reviews/mine")
    @PreAuthorize("hasAnyRole('TRAINEE','ADMIN')")
    public ResponseEntity<Void> deleteMyReview(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId) {
        if (identity.isStaff()) {
            getCourseReviewsUseCase.deleteStaffReview(identity.getUserId(), courseId);
        } else {
            getCourseReviewsUseCase.deleteReview(identity.getUserId(), courseId);
        }
        return ResponseEntity.noContent().build();
    }

    public record SubmitReviewRequest(int rating, String reviewText) {}
}
