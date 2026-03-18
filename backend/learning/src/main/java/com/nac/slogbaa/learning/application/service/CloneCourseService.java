package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.AddContentBlockCommand;
import com.nac.slogbaa.learning.application.dto.command.AddModuleCommand;
import com.nac.slogbaa.learning.application.dto.command.CreateCourseCommand;
import com.nac.slogbaa.learning.application.dto.result.ContentBlockSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.dto.result.ModuleSummary;
import com.nac.slogbaa.learning.application.port.in.CloneCourseUseCase;
import com.nac.slogbaa.learning.application.port.out.AdminCourseQueryPort;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.exception.CourseNotFoundException;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import com.nac.slogbaa.learning.core.valueobject.ModuleId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service: clone an existing course with all modules and content blocks.
 * The clone is always created unpublished.
 */
@Service
public class CloneCourseService implements CloneCourseUseCase {

    private final AdminCourseQueryPort adminCourseQueryPort;
    private final CourseWritePort courseWritePort;

    public CloneCourseService(AdminCourseQueryPort adminCourseQueryPort, CourseWritePort courseWritePort) {
        this.adminCourseQueryPort = adminCourseQueryPort;
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public UUID clone(UUID sourceCourseId, UUID clonedBy) {
        CourseDetails source = adminCourseQueryPort.findCourseDetailsByIdForAdmin(sourceCourseId)
                .orElseThrow(() -> new CourseNotFoundException(sourceCourseId));

        // Resolve the category ID from the source course
        UUID categoryId = adminCourseQueryPort.findCategoryIdByCourseId(sourceCourseId).orElse(null);

        // Create the clone course (unpublished)
        CreateCourseCommand createCmd = new CreateCourseCommand(
                source.getTitle() + " (Copy)",
                source.getDescription(),
                source.getImageUrl(),
                clonedBy,
                categoryId
        );
        CourseId newCourseId = courseWritePort.createCourse(createCmd);

        // Clone each module with its content blocks
        for (ModuleSummary module : source.getModules()) {
            AddModuleCommand moduleCmd = new AddModuleCommand(
                    newCourseId.getValue(),
                    module.getTitle(),
                    module.getDescription(),
                    module.getImageUrl(),
                    module.getModuleOrder(),
                    module.isHasQuiz(),
                    module.getEstimatedMinutes()
            );
            ModuleId newModuleId = courseWritePort.addModule(moduleCmd);

            // Clone content blocks for this module
            for (ContentBlockSummary block : module.getContentBlocks()) {
                AddContentBlockCommand blockCmd = new AddContentBlockCommand(
                        newModuleId.getValue(),
                        block.getBlockType(),
                        block.getBlockOrder(),
                        block.getRichText(),
                        block.getImageUrl(),
                        block.getImageAltText(),
                        block.getImageCaption(),
                        block.getVideoUrl(),
                        block.getVideoId(),
                        block.getActivityInstructions(),
                        block.getActivityResources()
                );
                courseWritePort.addContentBlock(blockCmd);
            }
        }

        return newCourseId.getValue();
    }
}
