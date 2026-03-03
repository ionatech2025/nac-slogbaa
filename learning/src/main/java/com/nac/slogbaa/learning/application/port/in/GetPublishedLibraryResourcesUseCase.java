package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.result.LibraryResourceSummary;

import java.util.List;

/**
 * Use case: list published library resources for trainees.
 */
public interface GetPublishedLibraryResourcesUseCase {

    List<LibraryResourceSummary> getPublishedResources();
}
