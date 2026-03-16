package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.UpdateCourseCommand;
import com.nac.slogbaa.learning.application.port.in.UpdateCourseUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateCourseService implements UpdateCourseUseCase {

    private final CourseWritePort courseWritePort;

    public UpdateCourseService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public void execute(UpdateCourseCommand command) {
        courseWritePort.updateCourse(
                command.getCourseId(),
                command.getTitle(),
                command.getDescription(),
                command.getImageUrl(),
                command.getCategoryId()
        );
    }
}
