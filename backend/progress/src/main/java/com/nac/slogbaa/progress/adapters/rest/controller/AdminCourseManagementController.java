package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.progress.adapters.persistence.entity.ModuleProgressEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeProgressEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaModuleProgressRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeProgressRepository;
import com.nac.slogbaa.shared.ports.CourseDeletionCheckPort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST controller for SuperAdmin course management: enrollments per course, progress, and can-delete checks.
 */
@RestController
@RequestMapping("/api/admin/course-management")
public class AdminCourseManagementController {

    private final JpaTraineeProgressRepository traineeProgressRepository;
    private final JpaModuleProgressRepository moduleProgressRepository;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final CourseDeletionCheckPort courseDeletionCheckPort;

    public AdminCourseManagementController(JpaTraineeProgressRepository traineeProgressRepository,
                                            JpaModuleProgressRepository moduleProgressRepository,
                                            GetTraineeByIdUseCase getTraineeByIdUseCase,
                                            CourseDeletionCheckPort courseDeletionCheckPort) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.moduleProgressRepository = moduleProgressRepository;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.courseDeletionCheckPort = courseDeletionCheckPort;
    }

    @GetMapping("/courses/{courseId}/enrollments")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<CourseEnrollmentResponse>> getEnrollments(@PathVariable UUID courseId) {
        List<TraineeProgressEntity> progressList = traineeProgressRepository.findByCourseIdOrderByEnrollmentDateDesc(courseId);
        List<CourseEnrollmentResponse> body = progressList.stream()
                .map(p -> {
                    String traineeName = getTraineeByIdUseCase.getById(p.getTraineeId())
                            .map(t -> t.getFirstName() + " " + t.getLastName())
                            .orElse(p.getTraineeId().toString());
                    List<UUID> completedModuleIds = moduleProgressRepository.findByTraineeProgressIdAndStatusCompleted(p.getId())
                            .stream()
                            .map(ModuleProgressEntity::getModuleId)
                            .collect(Collectors.toList());
                    return new CourseEnrollmentResponse(
                            p.getTraineeId().toString(),
                            traineeName,
                            p.getEnrollmentDate() != null ? p.getEnrollmentDate().toString() : null,
                            p.getCompletionPercentage(),
                            completedModuleIds.stream().map(UUID::toString).toList()
                    );
                })
                .toList();
        return ResponseEntity.ok(body);
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
