package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: record trainee progress (resume point and completion %) when viewing course content.
 */
public interface RecordProgressUseCase {

    void record(UUID traineeId, UUID courseId, UUID moduleId, UUID contentBlockId);
}
