package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.UpdateModuleCommand;

/**
 * Use case to update a module's title and description.
 */
public interface UpdateModuleUseCase {
    void execute(UpdateModuleCommand command);
}
