package com.nac.slogbaa.learning.adapters.persistence.adapter;

import com.nac.slogbaa.learning.adapters.persistence.entity.ContentBlockEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.ModuleEntity;
import com.nac.slogbaa.learning.adapters.persistence.mapper.EntityToDomainMapper;
import com.nac.slogbaa.learning.application.dto.result.AdminCourseSummary;
import com.nac.slogbaa.learning.application.dto.result.ContentBlockSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.dto.result.CourseSummary;
import com.nac.slogbaa.learning.application.dto.result.ModuleSummary;
import com.nac.slogbaa.learning.application.port.out.AdminCourseQueryPort;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.learning.application.port.out.CourseSummaryQueryPort;
import com.nac.slogbaa.learning.core.aggregate.CourseWithModules;
import com.nac.slogbaa.learning.core.entity.ContentBlock;
import com.nac.slogbaa.learning.core.entity.Module;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaContentBlockRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaCourseRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaModuleRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
public class CourseDetailsQueryAdapter implements CourseDetailsQueryPort, CourseSummaryQueryPort, AdminCourseQueryPort {

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

    @Override
    public Optional<CourseDetails> findCourseDetailsByIdIncludingUnpublished(UUID courseId) {
        return jpaCourseRepository.findById(courseId)
                .map(this::toCourseWithModules)
                .map(this::toCourseDetails);
    }

    @Cacheable("adminCourses")
    @Override
    public List<AdminCourseSummary> findAllCourses() {
        List<CourseEntity> courses = jpaCourseRepository.findAll();
        if (courses.isEmpty()) {
            return List.of();
        }

        // Batch fetch module counts in a single query instead of N queries
        List<UUID> courseIds = courses.stream().map(CourseEntity::getId).toList();
        Map<UUID, Integer> moduleCounts = new HashMap<>();
        for (Object[] row : jpaModuleRepository.findModuleStatsByCourseIds(courseIds)) {
            moduleCounts.put((UUID) row[0], ((Number) row[1]).intValue());
        }

        return courses.stream()
                .map(c -> {
                    int moduleCount = moduleCounts.getOrDefault(c.getId(), 0);
                    String categoryName = c.getCategory() != null ? c.getCategory().getName() : null;
                    String categorySlug = c.getCategory() != null ? c.getCategory().getSlug() : null;
                    return new AdminCourseSummary(
                            c.getId(),
                            c.getTitle(),
                            c.getDescription(),
                            c.getImageUrl(),
                            c.isPublished(),
                            moduleCount,
                            c.getCreatedAt(),
                            categoryName,
                            categorySlug
                    );
                })
                .toList();
    }

    @Override
    public Page<AdminCourseSummary> findAllCourses(Pageable pageable) {
        Page<CourseEntity> page = jpaCourseRepository.findAll(pageable);
        List<CourseEntity> courses = page.getContent();
        if (courses.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<UUID> courseIds = courses.stream().map(CourseEntity::getId).toList();
        Map<UUID, Integer> moduleCounts = new HashMap<>();
        for (Object[] row : jpaModuleRepository.findModuleStatsByCourseIds(courseIds)) {
            moduleCounts.put((UUID) row[0], ((Number) row[1]).intValue());
        }

        List<AdminCourseSummary> summaries = courses.stream()
                .map(c -> new AdminCourseSummary(
                        c.getId(),
                        c.getTitle(),
                        c.getDescription(),
                        c.getImageUrl(),
                        c.isPublished(),
                        moduleCounts.getOrDefault(c.getId(), 0),
                        c.getCreatedAt(),
                        c.getCategory() != null ? c.getCategory().getName() : null,
                        c.getCategory() != null ? c.getCategory().getSlug() : null
                ))
                .toList();

        return new PageImpl<>(summaries, pageable, page.getTotalElements());
    }

    @Override
    public long countAllCourses() {
        return jpaCourseRepository.count();
    }

    @Override
    public Optional<CourseDetails> findCourseDetailsByIdForAdmin(UUID courseId) {
        return jpaCourseRepository.findById(courseId)
                .map(this::toCourseWithModules)
                .map(this::toCourseDetails);
    }

    @Override
    public Optional<UUID> findCategoryIdByCourseId(UUID courseId) {
        return jpaCourseRepository.findById(courseId)
                .map(c -> c.getCategory() != null ? c.getCategory().getId() : null);
    }

    @Override
    public Optional<CourseSummary> getSummaryByCourseId(UUID courseId) {
        return jpaCourseRepository.findById(courseId)
                .filter(CourseEntity::isPublished)
                .map(entity -> {
                    CourseDetails d = toCourseDetails(toCourseWithModules(entity));
                    UUID prereqId = entity.getPrerequisiteCourseId();
                    String prereqName = null;
                    if (prereqId != null) {
                        prereqName = jpaCourseRepository.findById(prereqId)
                                .map(CourseEntity::getTitle)
                                .orElse(null);
                    }
                    return new CourseSummary(d.getId(), d.getTitle(), d.getDescription(), d.getImageUrl(),
                            d.getModules().size(), d.getTotalEstimatedMinutes(), d.getCategoryName(), d.getCategorySlug(),
                            prereqId, prereqName);
                });
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
        Integer totalEstimatedMinutes = modules.stream()
                .map(ModuleSummary::getEstimatedMinutes)
                .filter(java.util.Objects::nonNull)
                .reduce(0, Integer::sum);
        if (totalEstimatedMinutes == 0 && modules.stream().noneMatch(m -> m.getEstimatedMinutes() != null)) {
            totalEstimatedMinutes = null;
        }
        return new CourseDetails(
                domain.getId().getValue(),
                domain.getTitle(),
                domain.getDescription(),
                domain.getImageUrl(),
                domain.isPublished(),
                totalEstimatedMinutes,
                domain.getCategoryName(),
                domain.getCategorySlug(),
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
                m.getImageUrl(),
                m.getModuleOrder().getPosition(),
                m.isHasQuiz(),
                m.getEstimatedMinutes(),
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
