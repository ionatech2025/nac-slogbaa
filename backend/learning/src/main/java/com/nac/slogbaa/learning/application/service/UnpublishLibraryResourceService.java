package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.port.in.UnpublishLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceWritePort;
import com.nac.slogbaa.learning.core.exception.LibraryResourceNotFoundException;

import java.util.UUID;

/**
 * Application service: unpublish a library resource.
 */
public final class UnpublishLibraryResourceService implements UnpublishLibraryResourceUseCase {

    private final LibraryResourceWritePort libraryResourceWritePort;

    public UnpublishLibraryResourceService(LibraryResourceWritePort libraryResourceWritePort) {
        this.libraryResourceWritePort = libraryResourceWritePort;
    }

    @Override
    public void unpublish(UUID resourceId) {
        if (libraryResourceWritePort.findById(resourceId).isEmpty()) {
            throw new LibraryResourceNotFoundException(resourceId);
        }
        libraryResourceWritePort.setPublished(resourceId, false);
    }
}
