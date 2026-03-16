package com.nac.slogbaa.learning.core.exception;

import java.util.UUID;

/**
 * Thrown when a module cannot be deleted because at least one trainee has completed it.
 */
public class ModuleHasCompletionsException extends RuntimeException {

    public ModuleHasCompletionsException(UUID moduleId, long completionCount) {
        super("Module cannot be deleted: " + completionCount + " trainee(s) have completed it. Module id: " + moduleId);
    }
}
