package com.nac.slogbaa.learning.core.exception;

import java.util.UUID;

/**
 * Thrown when a library resource is not found by id.
 */
public class LibraryResourceNotFoundException extends RuntimeException {

    public LibraryResourceNotFoundException(UUID id) {
        super("Library resource not found: " + id);
    }
}
