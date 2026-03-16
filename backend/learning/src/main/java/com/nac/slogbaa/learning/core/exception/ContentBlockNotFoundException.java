package com.nac.slogbaa.learning.core.exception;

import java.util.UUID;

/**
 * Thrown when a content block is not found by id.
 */
public class ContentBlockNotFoundException extends RuntimeException {

    public ContentBlockNotFoundException(UUID id) {
        super("Content block not found: " + id);
    }
}
