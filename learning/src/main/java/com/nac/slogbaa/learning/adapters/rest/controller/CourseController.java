package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.learning.application.dto.result.ContentBlockSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.dto.result.CourseSummary;
import com.nac.slogbaa.learning.application.dto.result.ModuleSummary;
import com.nac.slogbaa.learning.application.port.in.GetCourseDetailsUseCase;
import com.nac.slogbaa.learning.application.port.in.GetPublishedCoursesUseCase;
import com.nac.slogbaa.learning.adapters.rest.dto.response.ContentBlockSummaryResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.CourseDetailsResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.CourseSummaryResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.ModuleSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for published courses. Secured for TRAINEE and STAFF (ADMIN, SUPER_ADMIN).
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final GetPublishedCoursesUseCase getPublishedCoursesUseCase;
    private final GetCourseDetailsUseCase getCourseDetailsUseCase;

    public CourseController(GetPublishedCoursesUseCase getPublishedCoursesUseCase,
                            GetCourseDetailsUseCase getCourseDetailsUseCase) {
        this.getPublishedCoursesUseCase = getPublishedCoursesUseCase;
        this.getCourseDetailsUseCase = getCourseDetailsUseCase;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TRAINEE','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<CourseSummaryResponse>> getPublishedCourses() {
        List<CourseSummary> summaries = getPublishedCoursesUseCase.getPublishedCourses();
        List<CourseSummaryResponse> response = summaries.stream()
                .map(this::toSummaryResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRAINEE','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<CourseDetailsResponse> getCourseDetails(@PathVariable UUID id) {
        CourseDetails details = getCourseDetailsUseCase.getById(id);
        return ResponseEntity.ok(toDetailsResponse(details));
    }

    private CourseSummaryResponse toSummaryResponse(CourseSummary s) {
        return new CourseSummaryResponse(
                s.getId().toString(),
                s.getTitle(),
                s.getDescription(),
                s.getImageUrl(),
                s.getModuleCount()
        );
    }

    private CourseDetailsResponse toDetailsResponse(CourseDetails d) {
        List<ModuleSummaryResponse> modules = d.getModules().stream()
                .map(this::toModuleResponse)
                .toList();
        return new CourseDetailsResponse(
                d.getId().toString(),
                d.getTitle(),
                d.getDescription(),
                d.getImageUrl(),
                d.isPublished(),
                modules
        );
    }

    private ModuleSummaryResponse toModuleResponse(ModuleSummary m) {
        List<ContentBlockSummaryResponse> blocks = m.getContentBlocks().stream()
                .map(this::toContentBlockResponse)
                .toList();
        return new ModuleSummaryResponse(
                m.getId().toString(),
                m.getTitle(),
                m.getDescription(),
                m.getImageUrl(),
                m.getModuleOrder(),
                m.isHasQuiz(),
                blocks
        );
    }

    private ContentBlockSummaryResponse toContentBlockResponse(ContentBlockSummary b) {
        return new ContentBlockSummaryResponse(
                b.getId().toString(),
                b.getBlockType(),
                b.getBlockOrder(),
                b.getRichText(),
                b.getImageUrl(),
                b.getImageAltText(),
                b.getImageCaption(),
                b.getVideoUrl(),
                b.getVideoId(),
                b.getActivityInstructions(),
                b.getActivityResources()
        );
    }
}
