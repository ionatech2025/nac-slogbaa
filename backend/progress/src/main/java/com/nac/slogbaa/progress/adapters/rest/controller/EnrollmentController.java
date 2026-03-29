package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.EnrolledCourseResult;
import com.nac.slogbaa.progress.application.port.in.EnrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.in.UnenrollTraineeUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nac.slogbaa.progress.application.port.in.GetResumePointUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordModuleCompletionUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordProgressUseCase;

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
    private final UnenrollTraineeUseCase unenrollTraineeUseCase;
    private final GetEnrolledCoursesUseCase getEnrolledCoursesUseCase;
    private final RecordProgressUseCase recordProgressUseCase;
    private final RecordModuleCompletionUseCase recordModuleCompletionUseCase;
    private final GetResumePointUseCase getResumePointUseCase;
    private final TraineeProgressRepositoryPort traineeProgressRepository;

    public EnrollmentController(EnrollTraineeUseCase enrollTraineeUseCase,
                               UnenrollTraineeUseCase unenrollTraineeUseCase,
                               GetEnrolledCoursesUseCase getEnrolledCoursesUseCase,
                               RecordProgressUseCase recordProgressUseCase,
                               RecordModuleCompletionUseCase recordModuleCompletionUseCase,
                               GetResumePointUseCase getResumePointUseCase,
                               TraineeProgressRepositoryPort traineeProgressRepository) {
        this.enrollTraineeUseCase = enrollTraineeUseCase;
        this.unenrollTraineeUseCase = unenrollTraineeUseCase;
        this.getEnrolledCoursesUseCase = getEnrolledCoursesUseCase;
        this.recordProgressUseCase = recordProgressUseCase;
        this.recordModuleCompletionUseCase = recordModuleCompletionUseCase;
        this.getResumePointUseCase = getResumePointUseCase;
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
                        r.imageUrl(),
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

    @DeleteMapping("/{courseId}/enroll")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> unenroll(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId) {
        unenrollTraineeUseCase.unenroll(identity.getUserId(), courseId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{courseId}/progress")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> recordProgress(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @RequestBody RecordProgressRequest request) {
        if (request != null && request.moduleId() != null && request.contentBlockId() != null) {
            recordProgressUseCase.record(identity.getUserId(), courseId, request.moduleId(), request.contentBlockId());
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{courseId}/modules/{moduleId}/complete")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> recordModuleComplete(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId,
            @RequestBody(required = false) RecordModuleCompleteRequest body) {
        boolean quizPassed = body != null && Boolean.TRUE.equals(body.quizPassed());
        recordModuleCompletionUseCase.record(identity.getUserId(), courseId, moduleId, quizPassed);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{courseId}/resume")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<ResumePointResponse> getResumePoint(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId) {
        return getResumePointUseCase.getResumePoint(identity.getUserId(), courseId)
                .map(rp -> new ResumePointResponse(rp.lastModuleId().toString(), rp.lastContentBlockId() != null ? rp.lastContentBlockId().toString() : null))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new ResumePointResponse(null, null)));
    }

    @GetMapping("/{courseId}/completed-modules")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<CompletedModulesResponse> getCompletedModules(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID courseId) {
        if (!traineeProgressRepository.existsByTraineeIdAndCourseId(identity.getUserId(), courseId)) {
            return ResponseEntity.ok(new CompletedModulesResponse(List.of()));
        }
        List<String> ids = traineeProgressRepository.findCompletedModuleIds(identity.getUserId(), courseId).stream()
                .map(UUID::toString)
                .toList();
        return ResponseEntity.ok(new CompletedModulesResponse(ids));
    }

    public record EnrolledCourseResponse(String id, String title, String description, String imageUrl, int moduleCount, int completionPercentage) {}
    public record RecordProgressRequest(java.util.UUID moduleId, java.util.UUID contentBlockId) {}
    public record RecordModuleCompleteRequest(Boolean quizPassed) {}
    public record ResumePointResponse(String lastModuleId, String lastContentBlockId) {}
    public record CompletedModulesResponse(List<String> completedModuleIds) {}
}
