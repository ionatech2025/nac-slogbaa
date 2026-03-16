package com.nac.slogbaa.learning.application.port.out;

import com.nac.slogbaa.learning.core.aggregate.Course;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port for course persistence. Implementations (JPA) in adapters.
 */
public interface CourseRepositoryPort {

    List<Course> findPublishedCourses();

    Optional<Course> findById(UUID id);
}
