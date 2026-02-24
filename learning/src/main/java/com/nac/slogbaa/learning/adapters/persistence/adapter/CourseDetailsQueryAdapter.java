package com.nac.slogbaa.learning.adapters.persistence.adapter;

import com.nac.slogbaa.learning.adapters.persistence.entity.ContentBlockEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.ModuleEntity;
import com.nac.slogbaa.learning.adapters.persistence.mapper.EntityToDomainMapper;
import com.nac.slogbaa.learning.application.dto.result.ContentBlockSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.dto.result.ModuleSummary;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.learning.core.aggregate.CourseWithModules;
import com.nac.slogbaa.learning.core.entity.ContentBlock;
import com.nac.slogbaa.learning.core.entity.Module;
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
    private final EntityToDomainMapper entityToDomainMapper;

    public CourseDetailsQueryAdapter(
            JpaCourseRepository jpaCourseRepository,
            JpaModuleRepository jpaModuleRepository,
            JpaContentBlockRepository jpaContentBlockRepository,
            EntityToDomainMapper entityToDomainMapper) {
        this.jpaCourseRepository = jpaCourseRepository;
        this.jpaModuleRepository = jpaModuleRepository;
        this.jpaContentBlockRepository = jpaContentBlockRepository;
        this.entityToDomainMapper = entityToDomainMapper;
    }

    @Override
    public Optional<CourseDetails> findCourseDetailsById(UUID courseId) {
        return jpaCourseRepository.findById(courseId)
                .filter(CourseEntity::isPublished)
                .map(this::toCourseWithModules)
                .map(this::toCourseDetails);
    }

    private CourseWithModules toCourseWithModules(CourseEntity course) {
        List<ModuleEntity> moduleEntities = jpaModuleRepository.findByCourseIdOrderByModuleOrder(course.getId());
        return entityToDomainMapper.toCourseWithModules(
                course,
                moduleEntities,
                m -> jpaContentBlockRepository.findByModuleIdOrderByBlockOrder(m.getId())
        );
    }

    private CourseDetails toCourseDetails(CourseWithModules domain) {
        List<ModuleSummary> modules = domain.getModules().stream()
                .map(this::toModuleSummary)
                .toList();
        return new CourseDetails(
                domain.getId().getValue(),
                domain.getTitle(),
                domain.getDescription(),
                domain.isPublished(),
                modules
        );
    }

    private ModuleSummary toModuleSummary(Module m) {
        List<ContentBlockSummary> blocks = m.getContentBlocks().stream()
                .map(this::toContentBlockSummary)
                .toList();
        return new ModuleSummary(
                m.getId().getValue(),
                m.getTitle(),
                m.getDescription(),
                m.getModuleOrder().getPosition(),
                m.isHasQuiz(),
                blocks
        );
    }

    private ContentBlockSummary toContentBlockSummary(ContentBlock b) {
        return new ContentBlockSummary(
                b.getId().getValue(),
                b.getBlockType().name(),
                b.getBlockOrder(),
                b.getRichText().orElse(null),
                b.getImageUrl().orElse(null),
                b.getImageAltText().orElse(null),
                b.getImageCaption().orElse(null),
                b.getVideoUrl().orElse(null),
                b.getVideoId().orElse(null),
                b.getActivityInstructions().orElse(null),
                b.getActivityResources().orElse(null)
        );
    }
}
