package com.nac.slogbaa.learning.adapters.persistence.adapter;

import com.nac.slogbaa.learning.adapters.persistence.entity.ContentBlockEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.ModuleEntity;
import com.nac.slogbaa.learning.application.dto.result.ContentBlockSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.dto.result.ModuleSummary;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaContentBlockRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaCourseRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaModuleRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CourseDetailsQueryAdapter implements CourseDetailsQueryPort {

    private final JpaCourseRepository jpaCourseRepository;
    private final JpaModuleRepository jpaModuleRepository;
    private final JpaContentBlockRepository jpaContentBlockRepository;

    public CourseDetailsQueryAdapter(
            JpaCourseRepository jpaCourseRepository,
            JpaModuleRepository jpaModuleRepository,
            JpaContentBlockRepository jpaContentBlockRepository) {
        this.jpaCourseRepository = jpaCourseRepository;
        this.jpaModuleRepository = jpaModuleRepository;
        this.jpaContentBlockRepository = jpaContentBlockRepository;
    }

    @Override
    public Optional<CourseDetails> findCourseDetailsById(UUID courseId) {
        return jpaCourseRepository.findById(courseId)
                .filter(CourseEntity::isPublished)
                .map(this::toCourseDetails);
    }

    private CourseDetails toCourseDetails(CourseEntity course) {
        List<ModuleEntity> moduleEntities = jpaModuleRepository.findByCourseIdOrderByModuleOrder(course.getId());
        List<ModuleSummary> modules = moduleEntities.stream()
                .map(this::toModuleSummary)
                .toList();
        return new CourseDetails(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.isPublished(),
                modules
        );
    }

    private ModuleSummary toModuleSummary(ModuleEntity module) {
        List<ContentBlockEntity> blockEntities = jpaContentBlockRepository.findByModuleIdOrderByBlockOrder(module.getId());
        List<ContentBlockSummary> blocks = blockEntities.stream()
                .map(this::toContentBlockSummary)
                .toList();
        return new ModuleSummary(
                module.getId(),
                module.getTitle(),
                module.getDescription(),
                module.getModuleOrder(),
                module.isHasQuiz(),
                blocks
        );
    }

    private ContentBlockSummary toContentBlockSummary(ContentBlockEntity block) {
        return new ContentBlockSummary(
                block.getId(),
                block.getBlockType().name(),
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
    }
}
