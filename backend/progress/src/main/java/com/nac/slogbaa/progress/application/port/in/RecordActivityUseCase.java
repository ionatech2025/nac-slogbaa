package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: record daily activity (minutes spent learning) for a trainee.
 * Updates the streak counters accordingly.
 */
public interface RecordActivityUseCase {

    void record(UUID traineeId, int minutes);
}
