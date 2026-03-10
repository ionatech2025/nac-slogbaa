package com.nac.slogbaa.learning.application.port.in;

import java.util.UUID;

/**
 * Use case: delete a module and all its content blocks. SuperAdmin only.
 * Fails if any trainee has completed this module.
 */
public interface DeleteModuleUseCase {

    void execute(UUID moduleId);
}
