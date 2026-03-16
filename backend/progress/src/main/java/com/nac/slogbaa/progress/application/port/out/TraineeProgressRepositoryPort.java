package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.application.dto.ResumePoint;
import com.nac.slogbaa.progress.core.aggregate.TraineeProgress;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Port for trainee progress persistence.
 */
public interface TraineeProgressRepositoryPort {

    TraineeProgress save(TraineeProgress progress);

    boolean existsByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    List<TraineeProgress> findByTraineeId(UUID traineeId);

    Optional<ResumePoint> findResumePoint(UUID traineeId, UUID courseId);

    void updateResumePoint(UUID traineeId, UUID courseId, UUID lastModuleId, UUID lastContentBlockId, int completionPercentage);

    /**
     * Update completion status and percentage (e.g. set COMPLETED when all modules are done).
     */
    void updateCompletionStatus(UUID traineeId, UUID courseId, String status, int completionPercentage);

    /**
     * Returns top trainees by completed courses. Map: traineeId -> count of completed courses.
     * Ordered by count descending, limited to the given size.
     */
    List<Map.Entry<UUID, Long>> findTopTraineesByCompletions(int limit);
}
