package com.nac.slogbaa.learning.adapters.persistence.mapper;

import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import com.nac.slogbaa.learning.core.aggregate.Course;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import org.springframework.stereotype.Component;

@Component
public class CourseEntityMapper {

    public Course toDomain(CourseEntity entity, int moduleCount) {
        if (entity == null) return null;
        return new Course(
                new CourseId(entity.getId()),
                entity.getTitle(),
                entity.getDescription(),
                entity.isPublished(),
                moduleCount
        );
    }
}
