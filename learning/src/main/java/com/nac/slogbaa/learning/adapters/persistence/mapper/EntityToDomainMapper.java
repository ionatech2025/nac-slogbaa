package com.nac.slogbaa.learning.adapters.persistence.mapper;

import com.nac.slogbaa.learning.adapters.persistence.entity.ContentBlockEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.ModuleEntity;
import com.nac.slogbaa.learning.core.aggregate.CourseWithModules;
import com.nac.slogbaa.learning.core.entity.ContentBlock;
import com.nac.slogbaa.learning.core.entity.Module;
import com.nac.slogbaa.learning.core.valueobject.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Maps persistence entities to domain types. Ensures modules and blocks are ordered consistently.
 */
@Component
public class EntityToDomainMapper {

    public CourseWithModules toCourseWithModules(
            com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity course,
            List<ModuleEntity> moduleEntities,
            java.util.function.Function<ModuleEntity, List<ContentBlockEntity>> blocksByModule) {
        List<Module> modules = moduleEntities.stream()
                .map(m -> toModule(m, blocksByModule.apply(m)))
                .toList();
        return new CourseWithModules(
                new CourseId(course.getId()),
                course.getTitle(),
                course.getDescription(),
                course.getImageUrl(),
                course.isPublished(),
                modules
        );
    }

    public Module toModule(ModuleEntity entity, List<ContentBlockEntity> blockEntities) {
        List<ContentBlock> blocks = blockEntities.stream()
                .map(this::toContentBlock)
                .toList();
        return new Module(
                new ModuleId(entity.getId()),
                entity.getTitle(),
                entity.getDescription(),
                new ModuleOrder(entity.getModuleOrder()),
                entity.isHasQuiz(),
                blocks
        );
    }

    public ContentBlock toContentBlock(ContentBlockEntity entity) {
        return new ContentBlock(
                new BlockId(entity.getId()),
                BlockType.valueOf(entity.getBlockType().name()),
                entity.getBlockOrder(),
                entity.getRichText(),
                entity.getImageUrl(),
                entity.getImageAltText(),
                entity.getImageCaption(),
                entity.getVideoUrl(),
                entity.getVideoId(),
                entity.getActivityInstructions(),
                entity.getActivityResources()
        );
    }
}
