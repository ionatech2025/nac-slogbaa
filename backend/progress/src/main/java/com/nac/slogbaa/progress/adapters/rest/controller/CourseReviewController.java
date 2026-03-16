package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.CourseRatingSummary;
import com.nac.slogbaa.progress.application.dto.CourseReviewResult;
import com.nac.slogbaa.progress.application.port.in.GetCourseReviewsUseCase;
import com.nac.slogbaa.progress.application.port.in.SubmitCourseReviewUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for course reviews and ratings.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseReviewController {

    private final SubmitCourseReviewUseCase submitCourseReviewUseCase;
    private final GetCourseReviewsUseCase getCourseReviewsUseCase;

    public CourseReviewController(SubmitCourseReviewUseCase submitCourseReviewUseCase,
                                  GetCourseReviewsUseCase getCourseReviewsUseCase) {
        this.submitCourseReviewUseCase = submitCourseReviewUseCase;
        this.getCourseReviewsUseCase = getCourseReviewsUseCase;
    }

    @PostMapping("/{courseId}/reviews")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> submitReview(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @RequestBody SubmitReviewRequest request) {
        submitCourseReviewUseCase.submit(
                identity.getUserId(),
                courseId,
                request.rating(),
                request.reviewText()
        );
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{courseId}/reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseReviewResult>> getReviews(
            @PathVariable UUID courseId) {
        return ResponseEntity.ok(getCourseReviewsUseCase.getReviews(courseId));
    }

    @GetMapping("/{courseId}/rating")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CourseRatingSummary> getRating(
            @PathVariable UUID courseId) {
        return ResponseEntity.ok(getCourseReviewsUseCase.getRatingSummary(courseId));
    }

    @DeleteMapping("/{courseId}/reviews/mine")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> deleteMyReview(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId) {
        getCourseReviewsUseCase.deleteReview(identity.getUserId(), courseId);
        return ResponseEntity.noContent().build();
    }

    public record SubmitReviewRequest(int rating, String reviewText) {}
}
