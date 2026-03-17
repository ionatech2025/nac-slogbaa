package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.result.CourseSummary;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Use case: list all published courses for trainees/staff.
 */
public interface GetPublishedCoursesUseCase {

    List<CourseSummary> getPublishedCourses();

    Page<CourseSummary> getPublishedCourses(Pageable pageable);
}
