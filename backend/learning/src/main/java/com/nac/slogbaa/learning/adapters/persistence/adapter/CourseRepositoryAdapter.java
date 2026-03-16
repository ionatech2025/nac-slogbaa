package com.nac.slogbaa.learning.adapters.persistence.adapter;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
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
    public Optional<Course> findById(UUID id) {
        return jpaCourseRepository.findById(id)
                .map(this::toDomainWithModuleCount);
    }

    @Override
    public boolean isPublished(UUID courseId) {
        return findById(courseId).map(Course::isPublished).orElse(false);
    }

    private Course toDomainWithModuleCount(CourseEntity entity) {
        int moduleCount = jpaModuleRepository.findByCourseIdOrderByModuleOrder(entity.getId()).size();
        return mapper.toDomain(entity, moduleCount);
    }
}
