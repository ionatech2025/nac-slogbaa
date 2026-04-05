package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.learning.adapters.rest.dto.response.ContentBlockSummaryResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.CourseDetailsResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.CourseSummaryResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.ModuleSummaryResponse;
import com.nac.slogbaa.learning.application.dto.result.ContentBlockSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.dto.result.CourseSummary;
import com.nac.slogbaa.learning.application.dto.result.ModuleSummary;
import com.nac.slogbaa.learning.application.port.in.GetCourseDetailsUseCase;
import com.nac.slogbaa.learning.application.port.in.GetPublishedCoursesUseCase;
import com.nac.slogbaa.learning.core.exception.CourseNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for public course listing and details.
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
    public ResponseEntity<List<CourseSummaryResponse>> getPublishedCourses() {
        List<CourseSummaryResponse> result = getPublishedCoursesUseCase.getPublishedCourses().stream()
                .map(this::toSummaryResponse)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<CourseSummaryResponse>> getPublishedCoursesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        String[] sortParts = sort.split(",");
        Sort s = Sort.by(sortParts[0]);
        if (sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1])) {
            s = s.descending();
        }
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), s);
        Page<CourseSummaryResponse> result = getPublishedCoursesUseCase.getPublishedCourses(pageable)
                .map(this::toSummaryResponse);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailsResponse> getCourseDetails(@PathVariable UUID id) {
        CourseDetails d = getCourseDetailsUseCase.getById(id)
                .orElseThrow(() -> new CourseNotFoundException(id));
        return ResponseEntity.ok(toDetailsResponse(d));
    }

    private CourseSummaryResponse toSummaryResponse(CourseSummary s) {
        return new CourseSummaryResponse(
                s.getId().toString(),
                s.getTitle(),
                s.getDescription(),
                s.getImageUrl(),
                s.getModuleCount(),
                s.getTotalEstimatedMinutes(),
                s.getCategoryName(),
                s.getCategorySlug(),
                s.getCategoryId(),
                s.getPrerequisiteCourseId() != null ? s.getPrerequisiteCourseId().toString() : null,
                s.getPrerequisiteCourseName(),
                s.getAverageRating(),
                s.getReviewCount()
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
                d.getTotalEstimatedMinutes(),
                d.getCategoryName(),
                d.getCategorySlug(),
                d.getCategoryId(),
                d.getAverageRating(),
                d.getReviewCount(),
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
                m.getEstimatedMinutes(),
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
