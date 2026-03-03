package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.UpdateLibraryResourceCommand;
import com.nac.slogbaa.learning.application.port.in.UpdateLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceWritePort;
import com.nac.slogbaa.learning.core.exception.LibraryResourceNotFoundException;

import java.util.UUID;

/**
 * Application service: update a library resource's metadata.
 */
public final class UpdateLibraryResourceService implements UpdateLibraryResourceUseCase {

    private final LibraryResourceWritePort libraryResourceWritePort;

    public UpdateLibraryResourceService(LibraryResourceWritePort libraryResourceWritePort) {
        this.libraryResourceWritePort = libraryResourceWritePort;
    }

    @Override
    public void update(UUID resourceId, UpdateLibraryResourceCommand command) {
        if (libraryResourceWritePort.findById(resourceId).isEmpty()) {
            throw new LibraryResourceNotFoundException(resourceId);
        }
        libraryResourceWritePort.update(resourceId, command);
    }
}
