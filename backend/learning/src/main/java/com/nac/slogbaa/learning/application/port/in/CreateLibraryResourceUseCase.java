package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.CreateLibraryResourceCommand;
import com.nac.slogbaa.learning.application.dto.result.AdminLibraryResourceSummary;

/**
 * Use case: create a new library resource (draft). SuperAdmin only.
 */
public interface CreateLibraryResourceUseCase {

    AdminLibraryResourceSummary create(CreateLibraryResourceCommand command);
}
