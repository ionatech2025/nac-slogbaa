package com.nac.slogbaa.learning.adapters.persistence.adapter;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.ModuleEntity;
import com.nac.slogbaa.learning.adapters.persistence.mapper.CourseEntityMapper;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaCourseRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaModuleRepository;
import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.learning.application.port.out.CourseRepositoryPort;
import com.nac.slogbaa.learning.core.aggregate.Course;

@Component
public class CourseRepositoryAdapter implements CourseRepositoryPort, CoursePublicationPort {

    private final JpaCourseRepository jpaCourseRepository;
    private final JpaModuleRepository jpaModuleRepository;
    private final CourseEntityMapper mapper;

    public CourseRepositoryAdapter(
            JpaCourseRepository jpaCourseRepository,
            JpaModuleRepository jpaModuleRepository,
            CourseEntityMapper mapper) {
        this.jpaCourseRepository = jpaCourseRepository;
        this.jpaModuleRepository = jpaModuleRepository;
        this.mapper = mapper;
    }

    @Cacheable("publishedCourses")
    @Override
    public List<Course> findPublishedCourses() {
        List<CourseEntity> entities = jpaCourseRepository.findByPublishedTrue();
        return toDomainListBatched(entities);
    }

    @Override
    public Page<Course> findPublishedCourses(Pageable pageable) {
        Page<CourseEntity> page = jpaCourseRepository.findByPublishedTrue(pageable);
        List<Course> courses = toDomainListBatched(page.getContent());
        return new PageImpl<>(courses, pageable, page.getTotalElements());
    }

    @Override
    public Optional<Course> findById(UUID id) {
        return jpaCourseRepository.findById(id)
                .map(this::toDomainWithModuleCount);
    }

    @Override
    public boolean isPublished(UUID courseId) {
        return findById(courseId).map(Course::isPublished).orElse(false);
    }

    @Override
    public Optional<UUID> getPrerequisiteCourseId(UUID courseId) {
        return jpaCourseRepository.findById(courseId)
                .map(CourseEntity::getPrerequisiteCourseId)
                .filter(Objects::nonNull);
    }

    @Override
    public Optional<String> getCourseTitle(UUID courseId) {
        return jpaCourseRepository.findById(courseId)
                .map(CourseEntity::getTitle);
    }

    /**
     * Batch-convert a list of course entities to domain objects using only 2-3 queries total
     * (instead of N*2 queries from the previous per-entity approach).
     */
    private List<Course> toDomainListBatched(List<CourseEntity> entities) {
        if (entities.isEmpty()) {
            return List.of();
        }

        List<UUID> courseIds = entities.stream().map(CourseEntity::getId).toList();

        // Batch 1: module stats (count + estimated minutes) — single query for all courses
        Map<UUID, int[]> moduleStats = new HashMap<>();
        for (Object[] row : jpaModuleRepository.findModuleStatsByCourseIds(courseIds)) {
            UUID courseId = (UUID) row[0];
            int moduleCount = ((Number) row[1]).intValue();
            int estimateCount = ((Number) row[2]).intValue();
            int totalMinutes = ((Number) row[3]).intValue();
            moduleStats.put(courseId, new int[]{moduleCount, estimateCount, totalMinutes});
        }

        // Batch 2: prerequisite course names — single query for all prerequisites
        Set<UUID> prereqIds = entities.stream()
                .map(CourseEntity::getPrerequisiteCourseId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<UUID, String> prereqNames = new HashMap<>();
        if (!prereqIds.isEmpty()) {
            for (Object[] row : jpaCourseRepository.findTitlesByIds(prereqIds)) {
                prereqNames.put((UUID) row[0], (String) row[1]);
            }
        }

        // Map entities to domain using batched data
        return entities.stream().map(entity -> {
            int[] stats = moduleStats.getOrDefault(entity.getId(), new int[]{0, 0, 0});
            int moduleCount = stats[0];
            Integer totalEstimatedMinutes = stats[1] > 0 ? stats[2] : null;
            String prerequisiteCourseName = entity.getPrerequisiteCourseId() != null
                    ? prereqNames.get(entity.getPrerequisiteCourseId())
                    : null;
            return mapper.toDomain(entity, moduleCount, totalEstimatedMinutes, prerequisiteCourseName);
        }).toList();
    }

    /**
     * Single-entity conversion (used for findById — only 2 queries for one course).
     */
    private Course toDomainWithModuleCount(CourseEntity entity) {
        List<ModuleEntity> modules = jpaModuleRepository.findByCourseIdOrderByModuleOrder(entity.getId());
        int moduleCount = modules.size();
        boolean anyEstimate = modules.stream().anyMatch(m -> m.getEstimatedMinutes() != null);
        Integer totalEstimatedMinutes = anyEstimate
                ? modules.stream().map(ModuleEntity::getEstimatedMinutes).filter(Objects::nonNull).reduce(0, Integer::sum)
                : null;
        String prerequisiteCourseName = null;
        if (entity.getPrerequisiteCourseId() != null) {
            prerequisiteCourseName = jpaCourseRepository.findById(entity.getPrerequisiteCourseId())
                    .map(CourseEntity::getTitle)
                    .orElse(null);
        }
        return mapper.toDomain(entity, moduleCount, totalEstimatedMinutes, prerequisiteCourseName);
    }
}
