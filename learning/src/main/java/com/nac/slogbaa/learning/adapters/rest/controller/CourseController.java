package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.learning.application.dto.result.CourseSummary;
import com.nac.slogbaa.learning.application.port.in.GetPublishedCoursesUseCase;
import com.nac.slogbaa.learning.adapters.rest.dto.response.CourseSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for published courses. Secured for TRAINEE and STAFF (ADMIN, SUPER_ADMIN).
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final GetPublishedCoursesUseCase getPublishedCoursesUseCase;

    public CourseController(GetPublishedCoursesUseCase getPublishedCoursesUseCase) {
        this.getPublishedCoursesUseCase = getPublishedCoursesUseCase;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TRAINEE','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<CourseSummaryResponse>> getPublishedCourses() {
        List<CourseSummary> summaries = getPublishedCoursesUseCase.getPublishedCourses();
        List<CourseSummaryResponse> response = summaries.stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    private CourseSummaryResponse toResponse(CourseSummary s) {
        return new CourseSummaryResponse(
                s.getId().toString(),
                s.getTitle(),
                s.getDescription(),
                s.getModuleCount()
        );
    }
}
