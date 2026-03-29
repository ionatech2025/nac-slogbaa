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

    /**
     * If a WITHDRAWN enrollment exists for the given trainee + course, reactivate it
     * by setting status back to IN_PROGRESS.
     *
     * @return true if a withdrawn record was found and reactivated, false otherwise
     */
    boolean reactivateIfWithdrawn(UUID traineeId, UUID courseId);

    /**
     * @return true if the trainee has completed the given course (status = COMPLETED)
     */
    boolean hasCompletedCourse(UUID traineeId, UUID courseId);

    /**
     * Module IDs the trainee has marked complete for this course enrollment (status COMPLETED).
     */
    List<UUID> findCompletedModuleIds(UUID traineeId, UUID courseId);
}
