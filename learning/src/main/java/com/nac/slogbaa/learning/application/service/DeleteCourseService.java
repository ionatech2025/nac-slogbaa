package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.port.in.DeleteCourseUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.exception.CourseHasEnrollmentsException;
import com.nac.slogbaa.shared.ports.CourseDeletionCheckPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class DeleteCourseService implements DeleteCourseUseCase {

    private final CourseDeletionCheckPort courseDeletionCheckPort;
    private final CourseWritePort courseWritePort;

    public DeleteCourseService(CourseDeletionCheckPort courseDeletionCheckPort,
                              CourseWritePort courseWritePort) {
        this.courseDeletionCheckPort = courseDeletionCheckPort;
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public void execute(UUID courseId) {
        long enrollments = courseDeletionCheckPort.countEnrollmentsByCourseId(courseId);
        if (enrollments > 0) {
            throw new CourseHasEnrollmentsException(courseId, enrollments);
        }
        courseWritePort.deleteCourse(courseId);
    }
}
