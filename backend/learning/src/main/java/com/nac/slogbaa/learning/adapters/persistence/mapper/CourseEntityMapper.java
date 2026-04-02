package com.nac.slogbaa.learning.adapters.persistence.mapper;

import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import com.nac.slogbaa.learning.core.aggregate.Course;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CourseEntityMapper {

    public Course toDomain(CourseEntity entity, int moduleCount) {
        return toDomain(entity, moduleCount, null);
    }

    public Course toDomain(CourseEntity entity, int moduleCount, Integer totalEstimatedMinutes) {
        return toDomain(entity, moduleCount, totalEstimatedMinutes, null);
    }

    public Course toDomain(CourseEntity entity, int moduleCount, Integer totalEstimatedMinutes, String prerequisiteCourseName) {
        if (entity == null) return null;
        String categoryName = entity.getCategory() != null ? entity.getCategory().getName() : null;
        String categorySlug = entity.getCategory() != null ? entity.getCategory().getSlug() : null;
        UUID categoryId = entity.getCategory() != null ? entity.getCategory().getId() : null;
        return new Course(
                new CourseId(entity.getId()),
                entity.getTitle(),
                entity.getDescription(),
                entity.getImageUrl(),
                entity.isPublished(),
                moduleCount,
                totalEstimatedMinutes,
                categoryName,
                categorySlug,
                categoryId,
                entity.getPrerequisiteCourseId(),
                prerequisiteCourseName
        );
    }
}
