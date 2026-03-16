package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.port.in.PublishLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceWritePort;
import com.nac.slogbaa.learning.core.exception.LibraryResourceNotFoundException;

import java.util.UUID;

/**
 * Application service: publish a library resource.
 */
public final class PublishLibraryResourceService implements PublishLibraryResourceUseCase {

    private final LibraryResourceWritePort libraryResourceWritePort;

    public PublishLibraryResourceService(LibraryResourceWritePort libraryResourceWritePort) {
        this.libraryResourceWritePort = libraryResourceWritePort;
    }

    @Override
    public void publish(UUID resourceId) {
        if (libraryResourceWritePort.findById(resourceId).isEmpty()) {
            throw new LibraryResourceNotFoundException(resourceId);
        }
        libraryResourceWritePort.setPublished(resourceId, true);
    }
}
