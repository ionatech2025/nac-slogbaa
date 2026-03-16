package com.nac.slogbaa.learning.application.port.in;

import java.util.UUID;

/**
 * Use case: delete a course and all its modules and content. SuperAdmin only.
 * Fails if any trainee is enrolled.
 */
public interface DeleteCourseUseCase {

    void execute(UUID courseId);
}
