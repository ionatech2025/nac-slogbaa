package com.nac.slogbaa.learning.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.learning.adapters.rest.dto.request.AddContentBlockRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.AddModuleRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.CreateCourseRequest;
import com.nac.slogbaa.learning.adapters.rest.dto.request.UpdateCourseRequest;
import com.nac.slogbaa.learning.application.dto.command.AddContentBlockCommand;
import com.nac.slogbaa.learning.application.dto.command.AddModuleCommand;
import com.nac.slogbaa.learning.application.dto.command.CreateCourseCommand;
import com.nac.slogbaa.learning.application.dto.command.PublishCourseCommand;
import com.nac.slogbaa.learning.application.dto.command.UpdateCourseCommand;
import com.nac.slogbaa.learning.application.port.in.AddContentBlockToModuleUseCase;
import com.nac.slogbaa.learning.application.port.in.AddModuleToCourseUseCase;
import com.nac.slogbaa.learning.application.port.in.CreateCourseUseCase;
import com.nac.slogbaa.learning.application.port.in.PublishCourseUseCase;
import com.nac.slogbaa.learning.application.port.in.UpdateCourseUseCase;
import com.nac.slogbaa.learning.core.valueobject.BlockId;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import com.nac.slogbaa.learning.core.valueobject.ModuleId;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

/**
 * REST controller for admin course management. SuperAdmin only.
 * Endpoints: create course, update course, add module, add content block, publish.
 */
@RestController
@RequestMapping("/api/admin/courses")
public class AdminCourseController {

    private final CreateCourseUseCase createCourseUseCase;
    private final UpdateCourseUseCase updateCourseUseCase;
    private final AddModuleToCourseUseCase addModuleToCourseUseCase;
    private final AddContentBlockToModuleUseCase addContentBlockToModuleUseCase;
    private final PublishCourseUseCase publishCourseUseCase;

    public AdminCourseController(CreateCourseUseCase createCourseUseCase,
                                UpdateCourseUseCase updateCourseUseCase,
                                AddModuleToCourseUseCase addModuleToCourseUseCase,
                                AddContentBlockToModuleUseCase addContentBlockToModuleUseCase,
                                PublishCourseUseCase publishCourseUseCase) {
        this.createCourseUseCase = createCourseUseCase;
        this.updateCourseUseCase = updateCourseUseCase;
        this.addModuleToCourseUseCase = addModuleToCourseUseCase;
        this.addContentBlockToModuleUseCase = addContentBlockToModuleUseCase;
        this.publishCourseUseCase = publishCourseUseCase;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        CreateCourseCommand command = new CreateCourseCommand(
                request.title(),
                request.description(),
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
                request.description()
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

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> publishCourse(@PathVariable UUID id) {
        PublishCourseCommand command = new PublishCourseCommand(id);
        publishCourseUseCase.execute(command);
        return ResponseEntity.noContent().build();
    }
}
