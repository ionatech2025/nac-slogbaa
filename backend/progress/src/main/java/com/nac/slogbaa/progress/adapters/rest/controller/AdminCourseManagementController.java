package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.progress.adapters.persistence.repository.JpaModuleProgressRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeProgressRepository;
import com.nac.slogbaa.shared.ports.CourseDeletionCheckPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for SuperAdmin course management: enrollments per course, progress, and can-delete checks.
 */
@RestController
@RequestMapping("/api/admin/course-management")
public class AdminCourseManagementController {

    private final JpaTraineeProgressRepository traineeProgressRepository;
    private final JpaModuleProgressRepository moduleProgressRepository;
    private final CourseDeletionCheckPort courseDeletionCheckPort;

    public AdminCourseManagementController(JpaTraineeProgressRepository traineeProgressRepository,
                                            JpaModuleProgressRepository moduleProgressRepository,
                                            CourseDeletionCheckPort courseDeletionCheckPort) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.moduleProgressRepository = moduleProgressRepository;
        this.courseDeletionCheckPort = courseDeletionCheckPort;
    }

    @GetMapping("/courses/{courseId}/enrollments")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<CourseEnrollmentResponse>> getEnrollments(
            @PathVariable UUID courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));

        Page<JpaTraineeProgressRepository.EnrollmentWithTraineeProjection> enrollmentPage =
            traineeProgressRepository.findEnrollmentsWithTrainee(courseId, pageable);

        // Batch fetch completed modules for all progress IDs on this page
        List<UUID> progressIds = enrollmentPage.getContent().stream()
            .map(JpaTraineeProgressRepository.EnrollmentWithTraineeProjection::getProgressId)
            .toList();

        Map<UUID, List<UUID>> completedModulesMap = new HashMap<>();
        if (!progressIds.isEmpty()) {
            for (Object[] row : moduleProgressRepository.findCompletedModulesByProgressIds(progressIds)) {
                UUID progressId = (UUID) row[0];
                UUID moduleId = (UUID) row[1];
                completedModulesMap.computeIfAbsent(progressId, k -> new ArrayList<>()).add(moduleId);
            }
        }

        Page<CourseEnrollmentResponse> result = enrollmentPage.map(p -> new CourseEnrollmentResponse(
            p.getTraineeId().toString(),
            p.getTraineeName(),
            p.getEnrollmentDate() != null ? p.getEnrollmentDate().toString() : null,
            p.getCompletionPercentage() != null ? p.getCompletionPercentage() : 0,
            completedModulesMap.getOrDefault(p.getProgressId(), List.of())
                .stream().map(UUID::toString).toList()
        ));

        return ResponseEntity.ok(result);
    }

    @GetMapping("/courses/{courseId}/can-delete")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<CanDeleteCourseResponse> canDeleteCourse(@PathVariable UUID courseId) {
        long enrollmentCount = courseDeletionCheckPort.countEnrollmentsByCourseId(courseId);
        return ResponseEntity.ok(new CanDeleteCourseResponse(enrollmentCount == 0, enrollmentCount));
    }

    @GetMapping("/courses/{courseId}/modules/{moduleId}/can-delete")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<CanDeleteModuleResponse> canDeleteModule(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId) {
        long completionCount = courseDeletionCheckPort.countModuleCompletionsByModuleId(moduleId);
        return ResponseEntity.ok(new CanDeleteModuleResponse(completionCount == 0, completionCount));
    }

    public record CourseEnrollmentResponse(String traineeId, String traineeName, String enrollmentDate, int completionPercentage, List<String> completedModuleIds) {}
    public record CanDeleteCourseResponse(boolean canDelete, long enrollmentCount) {}
    public record CanDeleteModuleResponse(boolean canDelete, long completionCount) {}
}
