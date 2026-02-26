package com.nac.slogbaa.learning.core.exception;

import java.util.UUID;

/**
 * Thrown when a module is not found by id.
 */
public class ModuleNotFoundException extends RuntimeException {

    public ModuleNotFoundException(UUID id) {
        super("Module not found: " + id);
    }
}
