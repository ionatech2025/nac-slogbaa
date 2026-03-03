package com.nac.slogbaa.learning.application.port.in;

import java.util.UUID;

/**
 * Use case: publish a library resource so trainees can see it. SuperAdmin only.
 */
public interface PublishLibraryResourceUseCase {

    void publish(UUID resourceId);
}
