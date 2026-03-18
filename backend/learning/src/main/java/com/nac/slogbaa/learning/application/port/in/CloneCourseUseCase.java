package com.nac.slogbaa.learning.application.port.in;

import java.util.UUID;

/**
 * Use case: clone an existing course with all its modules and content blocks.
 * Creates a new unpublished course with title "{Original Title} (Copy)".
 */
public interface CloneCourseUseCase {

    UUID clone(UUID sourceCourseId, UUID clonedBy);
}
