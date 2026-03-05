package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.progress.application.dto.EnrolledCourseResult;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for admin to fetch a trainee's enrolled courses.
 * Uses /api/admin/progress/trainees to avoid path overlap with IAM /api/admin/trainees.
 */
@RestController
@RequestMapping("/api/admin/progress/trainees")
public class AdminTraineeEnrollmentController {

    private final GetEnrolledCoursesUseCase getEnrolledCoursesUseCase;

    public AdminTraineeEnrollmentController(GetEnrolledCoursesUseCase getEnrolledCoursesUseCase) {
        this.getEnrolledCoursesUseCase = getEnrolledCoursesUseCase;
    }

    @GetMapping("/{traineeId}/enrolled-courses")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<EnrolledCourseResponse>> getEnrolledCourses(@PathVariable UUID traineeId) {
        List<EnrolledCourseResult> results = getEnrolledCoursesUseCase.getEnrolledCourses(traineeId);
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

    public record EnrolledCourseResponse(String id, String title, String description, String imageUrl, int moduleCount, int completionPercentage) {}
}
