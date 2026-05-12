package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.CreateCourseCommand;
import com.nac.slogbaa.learning.application.port.in.CreateCourseUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.nac.slogbaa.shared.events.SystemActivityEvent;

@Service
public class CreateCourseService implements CreateCourseUseCase {

    private final CourseWritePort courseWritePort;
    private final ApplicationEventPublisher eventPublisher;

    public CreateCourseService(CourseWritePort courseWritePort, ApplicationEventPublisher eventPublisher) {
        this.courseWritePort = courseWritePort;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public CourseId execute(CreateCourseCommand command) {
        CourseId courseId = courseWritePort.createCourse(command);
        eventPublisher.publishEvent(new SystemActivityEvent(
                command.getCreatedBy(),
                "SUPER_ADMIN",
                "CREATE",
                courseId.getValue().toString(),
                "Created new course: " + command.getTitle()
        ));
        return courseId;
    }
}
