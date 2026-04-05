package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.CreateLibraryResourceCommand;
import com.nac.slogbaa.learning.application.dto.result.AdminLibraryResourceSummary;
import com.nac.slogbaa.learning.application.port.in.CreateLibraryResourceUseCase;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceWritePort;

/**
 * Application service: create a new library resource (draft).
 */
public final class CreateLibraryResourceService implements CreateLibraryResourceUseCase {

    private final LibraryResourceWritePort libraryResourceWritePort;

    public CreateLibraryResourceService(LibraryResourceWritePort libraryResourceWritePort) {
        this.libraryResourceWritePort = libraryResourceWritePort;
    }

    @Override
    public AdminLibraryResourceSummary create(CreateLibraryResourceCommand command) {
        var id = libraryResourceWritePort.create(command);
        var r = libraryResourceWritePort.findById(id).orElseThrow();
        return new AdminLibraryResourceSummary(
                r.id(), r.title(), r.description(), r.resourceType(),
                r.fileUrl(), r.fileType(), r.published(), r.courseId());
    }
}
