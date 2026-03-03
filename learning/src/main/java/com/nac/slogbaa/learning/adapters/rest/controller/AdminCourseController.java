package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.learning.adapters.rest.dto.request.AddContentBlockRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.AddModuleRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.CreateCourseRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.UpdateContentBlockRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.UpdateCourseRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.UpdateModuleRequest;
import com.nac.slogbaa.learning.application.dto.command.AddContentBlockCommand;
import com.nac.slogbaa.learning.application.dto.command.AddModuleCommand;
import com.nac.slogbaa.learning.application.dto.command.UpdateModuleCommand;
import com.nac.slogbaa.learning.application.dto.command.CreateCourseCommand;
import com.nac.slogbaa.learning.application.dto.command.PublishCourseCommand;
import com.nac.slogbaa.learning.application.dto.command.UpdateContentBlockCommand;
import com.nac.slogbaa.learning.application.dto.command.UpdateCourseCommand;
import com.nac.slogbaa.learning.application.port.in.AddContentBlockToModuleUseCase;
import com.nac.slogbaa.learning.application.port.in.AddModuleToCourseUseCase;
import com.nac.slogbaa.learning.application.port.in.CreateCourseUseCase;
import com.nac.slogbaa.learning.application.port.in.GetAdminCourseDetailsUseCase;
import com.nac.slogbaa.learning.application.port.in.GetAdminCoursesUseCase;
import com.nac.slogbaa.learning.application.port.in.PublishCourseUseCase;
import com.nac.slogbaa.learning.application.port.in.DeleteContentBlockUseCase;
import com.nac.slogbaa.learning.application.port.in.UpdateContentBlockUseCase;
import com.nac.slogbaa.learning.application.port.in.UpdateCourseUseCase;
import com.nac.slogbaa.learning.application.port.in.UpdateModuleUseCase;
import com.nac.slogbaa.learning.core.valueobject.BlockId;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import com.nac.slogbaa.learning.core.valueobject.ModuleId;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nac.slogbaa.learning.adapters.rest.dto.response.AdminCourseSummaryResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.CourseDetailsResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.ContentBlockSummaryResponse;
import com.nac.slogbaa.learning.adapters.rest.dto.response.ModuleSummaryResponse;
import com.nac.slogbaa.learning.application.dto.result.ContentBlockSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.dto.result.ModuleSummary;
import com.nac.slogbaa.learning.core.exception.CourseNotFoundException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for admin course management. SuperAdmin only.
 * Endpoints: create course, update course, add module, add content block, publish.
 */
@RestController
@RequestMapping("/api/admin/courses")
public class AdminCourseController {

    private final GetAdminCoursesUseCase getAdminCoursesUseCase;
    private final GetAdminCourseDetailsUseCase getAdminCourseDetailsUseCase;
    private final CreateCourseUseCase createCourseUseCase;
    private final UpdateCourseUseCase updateCourseUseCase;
    private final AddModuleToCourseUseCase addModuleToCourseUseCase;
    private final UpdateModuleUseCase updateModuleUseCase;
    private final AddContentBlockToModuleUseCase addContentBlockToModuleUseCase;
    private final UpdateContentBlockUseCase updateContentBlockUseCase;
    private final DeleteContentBlockUseCase deleteContentBlockUseCase;
    private final PublishCourseUseCase publishCourseUseCase;

    public AdminCourseController(GetAdminCoursesUseCase getAdminCoursesUseCase,
                                GetAdminCourseDetailsUseCase getAdminCourseDetailsUseCase,
                                CreateCourseUseCase createCourseUseCase,
                                UpdateCourseUseCase updateCourseUseCase,
                                AddModuleToCourseUseCase addModuleToCourseUseCase,
                                UpdateModuleUseCase updateModuleUseCase,
                                AddContentBlockToModuleUseCase addContentBlockToModuleUseCase,
                                UpdateContentBlockUseCase updateContentBlockUseCase,
                                DeleteContentBlockUseCase deleteContentBlockUseCase,
                                PublishCourseUseCase publishCourseUseCase) {
        this.getAdminCoursesUseCase = getAdminCoursesUseCase;
        this.getAdminCourseDetailsUseCase = getAdminCourseDetailsUseCase;
        this.createCourseUseCase = createCourseUseCase;
        this.updateCourseUseCase = updateCourseUseCase;
        this.addModuleToCourseUseCase = addModuleToCourseUseCase;
        this.updateModuleUseCase = updateModuleUseCase;
        this.addContentBlockToModuleUseCase = addContentBlockToModuleUseCase;
        this.updateContentBlockUseCase = updateContentBlockUseCase;
        this.deleteContentBlockUseCase = deleteContentBlockUseCase;
        this.publishCourseUseCase = publishCourseUseCase;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<AdminCourseSummaryResponse>> getAllCourses() {
        List<AdminCourseSummaryResponse> list = getAdminCoursesUseCase.getAllCourses().stream()
                .map(s -> new AdminCourseSummaryResponse(
                        s.getId().toString(),
                        s.getTitle(),
                        s.getDescription(),
                        s.getImageUrl(),
                        s.isPublished(),
                        s.getModuleCount()
                ))
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<CourseDetailsResponse> getCourseDetails(@PathVariable UUID id) {
        CourseDetails d = getAdminCourseDetailsUseCase.getById(id)
                .orElseThrow(() -> new CourseNotFoundException(id));
        return ResponseEntity.ok(toDetailsResponse(d));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        CreateCourseCommand command = new CreateCourseCommand(
                request.title(),
                request.description(),
                request.imageUrl(),
                identity.getUserId()
        );
        CourseId courseId = createCourseUseCase.execute(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("id", courseId.getValue().toString()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> updateCourse(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCourseRequest request) {
        UpdateCourseCommand command = new UpdateCourseCommand(
                id,
                request.title(),
                request.description(),
                request.imageUrl()
        );
        updateCourseUseCase.execute(command);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/modules")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> addModule(
            @PathVariable UUID id,
            @Valid @RequestBody AddModuleRequest request) {
        AddModuleCommand command = new AddModuleCommand(
                id,
                request.title(),
                request.description(),
                request.moduleOrder(),
                request.hasQuiz()
        );
        ModuleId moduleId = addModuleToCourseUseCase.execute(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("id", moduleId.getValue().toString()));
    }

    @PutMapping("/{courseId}/modules/{moduleId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> updateModule(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId,
            @Valid @RequestBody UpdateModuleRequest request) {
        UpdateModuleCommand command = new UpdateModuleCommand(
                moduleId,
                request.title(),
                request.description()
        );
        updateModuleUseCase.execute(command);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{courseId}/modules/{moduleId}/blocks")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> addContentBlock(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId,
            @Valid @RequestBody AddContentBlockRequest request) {
        AddContentBlockCommand command = new AddContentBlockCommand(
                moduleId,
                request.blockType().toUpperCase(),
                request.blockOrder(),
                request.richText(),
                request.imageUrl(),
                request.imageAltText(),
                request.imageCaption(),
                request.videoUrl(),
                request.videoId(),
                request.activityInstructions(),
                request.activityResources()
        );
        BlockId blockId = addContentBlockToModuleUseCase.execute(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("id", blockId.getValue().toString()));
    }

    @PutMapping("/{courseId}/modules/{moduleId}/blocks/{blockId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> updateContentBlock(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId,
            @PathVariable UUID blockId,
            @Valid @RequestBody UpdateContentBlockRequest request) {
        UpdateContentBlockCommand command = new UpdateContentBlockCommand(
                blockId,
                moduleId,
                request.blockType().toUpperCase(),
                request.blockOrder(),
                request.richText(),
                request.imageUrl(),
                request.imageAltText(),
                request.imageCaption(),
                request.videoUrl(),
                request.videoId(),
                request.activityInstructions(),
                request.activityResources()
        );
        updateContentBlockUseCase.execute(command);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{courseId}/modules/{moduleId}/blocks/{blockId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteContentBlock(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId,
            @PathVariable UUID blockId) {
        deleteContentBlockUseCase.execute(blockId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> publishCourse(@PathVariable UUID id) {
        PublishCourseCommand command = new PublishCourseCommand(id);
        publishCourseUseCase.execute(command);
        return ResponseEntity.noContent().build();
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
