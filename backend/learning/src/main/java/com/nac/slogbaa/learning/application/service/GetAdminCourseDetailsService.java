package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.port.in.GetAdminCourseDetailsUseCase;
import com.nac.slogbaa.learning.application.port.out.AdminCourseQueryPort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class GetAdminCourseDetailsService implements GetAdminCourseDetailsUseCase {

    private final AdminCourseQueryPort adminCourseQueryPort;

    public GetAdminCourseDetailsService(AdminCourseQueryPort adminCourseQueryPort) {
        this.adminCourseQueryPort = adminCourseQueryPort;
    }

    @Override
    public Optional<CourseDetails> getById(UUID courseId) {
        return adminCourseQueryPort.findCourseDetailsByIdForAdmin(courseId);
    }
}
