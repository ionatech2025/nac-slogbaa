package com.nac.slogbaa.learning.adapters.persistence.adapter;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
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
        return jpaCourseRepository.findByPublishedTrue().stream()
                .map(this::toDomainWithModuleCount)
                .toList();
    }

    @Override
    public Page<Course> findPublishedCourses(Pageable pageable) {
        return jpaCourseRepository.findByPublishedTrue(pageable)
                .map(this::toDomainWithModuleCount);
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

    private Course toDomainWithModuleCount(CourseEntity entity) {
        List<ModuleEntity> modules = jpaModuleRepository.findByCourseIdOrderByModuleOrder(entity.getId());
        int moduleCount = modules.size();
        boolean anyEstimate = modules.stream().anyMatch(m -> m.getEstimatedMinutes() != null);
        Integer totalEstimatedMinutes = anyEstimate
                ? modules.stream().map(ModuleEntity::getEstimatedMinutes).filter(java.util.Objects::nonNull).reduce(0, Integer::sum)
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
