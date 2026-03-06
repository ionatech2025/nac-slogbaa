package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.progress.application.port.in.RecordModuleCompletionUseCase;
import com.nac.slogbaa.progress.application.port.out.ModuleCompletionPort;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;

import java.util.UUID;

/**
 * Records module completion. Rule: course is complete when all modules are completed.
 */
public final class RecordModuleCompletionService implements RecordModuleCompletionUseCase {

    private static final String STATUS_COMPLETED = "COMPLETED";

    private final TraineeProgressRepositoryPort traineeProgressRepository;
    private final ModuleCompletionPort moduleCompletionPort;
    private final CourseDetailsQueryPort courseDetailsQueryPort;

    public RecordModuleCompletionService(TraineeProgressRepositoryPort traineeProgressRepository,
                                         ModuleCompletionPort moduleCompletionPort,
                                         CourseDetailsQueryPort courseDetailsQueryPort) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.moduleCompletionPort = moduleCompletionPort;
        this.courseDetailsQueryPort = courseDetailsQueryPort;
    }

    @Override
    public void record(UUID traineeId, UUID courseId, UUID moduleId) {
        if (!traineeProgressRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            return;
        }

        moduleCompletionPort.recordModuleCompleted(traineeId, courseId, moduleId);

        int totalModules = courseDetailsQueryPort.findCourseDetailsById(courseId)
                .map(c -> c.getModules().size())
                .orElse(0);
        if (totalModules == 0) {
            return;
        }

        long completedCount = moduleCompletionPort.countCompletedModules(traineeId, courseId);
        int completionPercentage = (int) ((100 * completedCount) / totalModules);
        boolean allComplete = completedCount >= totalModules;
        String status = allComplete ? STATUS_COMPLETED : "IN_PROGRESS";
        int percentage = allComplete ? 100 : completionPercentage;

        traineeProgressRepository.updateCompletionStatus(traineeId, courseId, status, percentage);
    }
}
