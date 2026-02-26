package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.result.AdminCourseSummary;
import com.nac.slogbaa.learning.application.port.in.GetAdminCoursesUseCase;
import com.nac.slogbaa.learning.application.port.out.AdminCourseQueryPort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAdminCoursesService implements GetAdminCoursesUseCase {

    private final AdminCourseQueryPort adminCourseQueryPort;

    public GetAdminCoursesService(AdminCourseQueryPort adminCourseQueryPort) {
        this.adminCourseQueryPort = adminCourseQueryPort;
    }

    @Override
    public List<AdminCourseSummary> getAllCourses() {
        return adminCourseQueryPort.findAllCourses();
    }
}
