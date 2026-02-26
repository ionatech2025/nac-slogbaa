package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.UpdateCourseCommand;

/**
 * Use case: update an existing course.
 */
public interface UpdateCourseUseCase {

    void execute(UpdateCourseCommand command);
}
