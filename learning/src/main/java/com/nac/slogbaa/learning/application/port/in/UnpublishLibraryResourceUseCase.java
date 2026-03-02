package com.nac.slogbaa.learning.application.port.in;

import java.util.UUID;

/**
 * Use case: unpublish a library resource so trainees no longer see it. SuperAdmin only.
 */
public interface UnpublishLibraryResourceUseCase {

    void unpublish(UUID resourceId);
}
