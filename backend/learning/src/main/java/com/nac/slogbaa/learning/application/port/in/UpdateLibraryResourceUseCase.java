package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.UpdateLibraryResourceCommand;

import java.util.UUID;

/**
 * Use case: update a library resource's metadata (title, description, link, etc.). SuperAdmin only.
 */
public interface UpdateLibraryResourceUseCase {

    void update(UUID resourceId, UpdateLibraryResourceCommand command);
}
