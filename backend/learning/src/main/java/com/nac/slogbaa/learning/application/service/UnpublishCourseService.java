package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.UnpublishCourseCommand;
import com.nac.slogbaa.learning.application.port.in.UnpublishCourseUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import org.springframework.stereotype.Service;

@Service
public class UnpublishCourseService implements UnpublishCourseUseCase {

    private final CourseWritePort courseWritePort;

    public UnpublishCourseService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    public void execute(UnpublishCourseCommand command) {
        courseWritePort.unpublish(new CourseId(command.getCourseId()));
    }
}
