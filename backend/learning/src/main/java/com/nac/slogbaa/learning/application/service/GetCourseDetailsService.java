package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.port.in.GetCourseDetailsUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;

import java.util.Optional;
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
    public Optional<CourseDetails> getById(UUID courseId) {
        return courseDetailsQueryPort.findCourseDetailsById(courseId);
    }
}
