package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.UnpublishCourseCommand;

/**
 * Use case: unpublish a course (hide it from trainees). SuperAdmin only.
 */
public interface UnpublishCourseUseCase {

    void execute(UnpublishCourseCommand command);
}
