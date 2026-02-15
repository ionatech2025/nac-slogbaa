package com.nac.slogbaa.iam.core.exception;

import java.util.UUID;

/**
 * Thrown when a trainee is not found by id.
 */
public class TraineeNotFoundException extends RuntimeException {

    public TraineeNotFoundException(UUID id) {
        super("Trainee not found: " + id);
    }
}
