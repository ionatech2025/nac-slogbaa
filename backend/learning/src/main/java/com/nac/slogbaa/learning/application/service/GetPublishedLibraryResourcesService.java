package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.result.LibraryResourceSummary;
import com.nac.slogbaa.learning.application.port.in.GetPublishedLibraryResourcesUseCase;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceQueryPort;

import java.util.List;

/**
 * Application service: list published library resources.
 */
public final class GetPublishedLibraryResourcesService implements GetPublishedLibraryResourcesUseCase {

    private final LibraryResourceQueryPort libraryResourceQueryPort;

    public GetPublishedLibraryResourcesService(LibraryResourceQueryPort libraryResourceQueryPort) {
        this.libraryResourceQueryPort = libraryResourceQueryPort;
    }

    @Override
    public List<LibraryResourceSummary> getPublishedResources() {
        return libraryResourceQueryPort.findPublished();
    }
}
