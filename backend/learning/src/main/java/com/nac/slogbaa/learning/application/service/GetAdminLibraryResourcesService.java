package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.result.AdminLibraryResourceSummary;
import com.nac.slogbaa.learning.application.port.in.GetAdminLibraryResourcesUseCase;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceWritePort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Application service: list all library resources for admin.
 */
public final class GetAdminLibraryResourcesService implements GetAdminLibraryResourcesUseCase {

    private final LibraryResourceWritePort libraryResourceWritePort;

    public GetAdminLibraryResourcesService(LibraryResourceWritePort libraryResourceWritePort) {
        this.libraryResourceWritePort = libraryResourceWritePort;
    }

    @Override
    public List<AdminLibraryResourceSummary> getAll() {
        return libraryResourceWritePort.findAll().stream()
                .map(r -> new AdminLibraryResourceSummary(
                        r.id(), r.title(), r.description(), r.resourceType(),
                        r.fileUrl(), r.fileType(), r.published()))
                .toList();
    }

    @Override
    public Page<AdminLibraryResourceSummary> getAll(Pageable pageable) {
        return libraryResourceWritePort.findAll(pageable)
                .map(r -> new AdminLibraryResourceSummary(
                        r.id(), r.title(), r.description(), r.resourceType(),
                        r.fileUrl(), r.fileType(), r.published()));
    }
}
