package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.CreateCourseCommand;
import com.nac.slogbaa.learning.application.port.in.CreateCourseUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateCourseService implements CreateCourseUseCase {

    private final CourseWritePort courseWritePort;

    public CreateCourseService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public CourseId execute(CreateCourseCommand command) {
        return courseWritePort.createCourse(command);
    }
}
