package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.EnrolledCourseResult;
import com.nac.slogbaa.progress.application.port.in.EnrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for course enrollment and enrolled list. TRAINEE only.
 * Paths under /api/courses to match frontend; more specific than Learning's /api/courses/{id}.
 */
@RestController
@RequestMapping("/api/courses")
public class EnrollmentController {

    private final EnrollTraineeUseCase enrollTraineeUseCase;
    private final GetEnrolledCoursesUseCase getEnrolledCoursesUseCase;
    private final TraineeProgressRepositoryPort traineeProgressRepository;

    public EnrollmentController(EnrollTraineeUseCase enrollTraineeUseCase,
                               GetEnrolledCoursesUseCase getEnrolledCoursesUseCase,
                               TraineeProgressRepositoryPort traineeProgressRepository) {
        this.enrollTraineeUseCase = enrollTraineeUseCase;
        this.getEnrolledCoursesUseCase = getEnrolledCoursesUseCase;
        this.traineeProgressRepository = traineeProgressRepository;
    }

    @GetMapping("/enrolled")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<List<EnrolledCourseResponse>> getEnrolled(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        List<EnrolledCourseResult> results = getEnrolledCoursesUseCase.getEnrolledCourses(identity.getUserId());
        List<EnrolledCourseResponse> body = results.stream()
                .map(r -> new EnrolledCourseResponse(
                        r.id().toString(),
                        r.title(),
                        r.description(),
                        r.moduleCount(),
                        r.completionPercentage()))
                .toList();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{courseId}/enrollment")
    @PreAuthorize("hasAnyRole('TRAINEE','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Map<String, Boolean>> getEnrollmentStatus(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId) {
        boolean enrolled = traineeProgressRepository.existsByTraineeIdAndCourseId(identity.getUserId(), courseId);
        return ResponseEntity.ok(Map.of("enrolled", enrolled));
    }

    @PostMapping("/{courseId}/enroll")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> enroll(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId) {
        enrollTraineeUseCase.enroll(identity.getUserId(), courseId);
        return ResponseEntity.noContent().build();
    }

    public record EnrolledCourseResponse(String id, String title, String description, int moduleCount, int completionPercentage) {}
}
