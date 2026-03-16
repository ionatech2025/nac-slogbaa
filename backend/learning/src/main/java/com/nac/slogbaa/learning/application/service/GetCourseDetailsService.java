package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.port.in.GetCourseDetailsUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.learning.core.exception.CourseNotFoundException;

import java.util.UUID;

/**
 * Application service: get full course details with modules and content blocks.
 */
public final class GetCourseDetailsService implements GetCourseDetailsUseCase {

    private final CourseDetailsQueryPort courseDetailsQueryPort;

    public GetCourseDetailsService(CourseDetailsQueryPort courseDetailsQueryPort) {
        this.courseDetailsQueryPort = courseDetailsQueryPort;
    }

    @Override
    public CourseDetails getById(UUID courseId) {
        return courseDetailsQueryPort.findCourseDetailsById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));
    }
}
