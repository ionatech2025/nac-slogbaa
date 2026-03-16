package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.CreateCourseCommand;
import com.nac.slogbaa.learning.core.valueobject.CourseId;

/**
 * Use case: create a new course. SuperAdmin only.
 */
public interface CreateCourseUseCase {

    CourseId execute(CreateCourseCommand command);
}
