package com.nac.slogbaa.learning.adapters.persistence.adapter;

import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import com.nac.slogbaa.learning.adapters.persistence.mapper.CourseEntityMapper;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaCourseRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaModuleRepository;
import com.nac.slogbaa.learning.application.port.out.CourseRepositoryPort;
import com.nac.slogbaa.learning.core.aggregate.Course;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CourseRepositoryAdapter implements CourseRepositoryPort {

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

    @Override
    public List<Course> findPublishedCourses() {
        return jpaCourseRepository.findByIsPublishedTrue().stream()
                .map(this::toDomainWithModuleCount)
                .toList();
    }

    @Override
    public Optional<Course> findById(UUID id) {
        return jpaCourseRepository.findById(id)
                .map(this::toDomainWithModuleCount);
    }

    private Course toDomainWithModuleCount(CourseEntity entity) {
        int moduleCount = jpaModuleRepository.findByCourseIdOrderByModuleOrder(entity.getId()).size();
        return mapper.toDomain(entity, moduleCount);
    }
}
