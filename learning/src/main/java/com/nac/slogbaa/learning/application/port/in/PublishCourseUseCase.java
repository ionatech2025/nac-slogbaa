package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.PublishCourseCommand;

/**
 * Use case: publish a course (make it visible to trainees).
 */
public interface PublishCourseUseCase {

    void execute(PublishCourseCommand command);
}
