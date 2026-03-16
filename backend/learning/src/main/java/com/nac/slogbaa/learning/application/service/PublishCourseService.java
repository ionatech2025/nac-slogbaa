package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.PublishCourseCommand;
import com.nac.slogbaa.learning.application.port.in.PublishCourseUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublishCourseService implements PublishCourseUseCase {

    private final CourseWritePort courseWritePort;

    public PublishCourseService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public void execute(PublishCourseCommand command) {
        courseWritePort.publish(new CourseId(command.getCourseId()));
    }
}
