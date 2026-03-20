package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.CourseRatingSummary;
import com.nac.slogbaa.progress.application.dto.CourseReviewResult;
import com.nac.slogbaa.progress.application.port.in.GetCourseReviewsUseCase;
import com.nac.slogbaa.progress.application.port.in.SubmitCourseReviewUseCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> deleteMyReview(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId) {
        getCourseReviewsUseCase.deleteReview(identity.getUserId(), courseId);
        return ResponseEntity.noContent().build();
    }

    public record SubmitReviewRequest(int rating, String reviewText) {}
}
