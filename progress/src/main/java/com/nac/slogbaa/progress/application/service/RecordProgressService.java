package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.dto.result.ContentBlockSummary;
import com.nac.slogbaa.learning.application.dto.result.CourseDetails;
import com.nac.slogbaa.learning.application.dto.result.ModuleSummary;
import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.progress.application.port.in.RecordProgressUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * Records trainee progress (resume point and completion %) when viewing course content.
 * Completion % = (modules completed / total modules) * 100. A module is completed when
 * the trainee has viewed its last content block.
 */
public final class RecordProgressService implements RecordProgressUseCase {

    private final TraineeProgressRepositoryPort traineeProgressRepository;
    private final CourseDetailsQueryPort courseDetailsQueryPort;

    public RecordProgressService(TraineeProgressRepositoryPort traineeProgressRepository,
                                CourseDetailsQueryPort courseDetailsQueryPort) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.courseDetailsQueryPort = courseDetailsQueryPort;
    }

    @Override
    public void record(UUID traineeId, UUID courseId, UUID moduleId, UUID contentBlockId) {
        if (!traineeProgressRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            return; // not enrolled, ignore
        }

        var courseOpt = courseDetailsQueryPort.findCourseDetailsById(courseId);
        if (courseOpt.isEmpty()) {
            return;
        }

        CourseDetails course = courseOpt.get();
        List<ModuleSummary> modules = course.getModules();
        if (modules.isEmpty()) {
            return;
        }

        int moduleIndex = findModuleIndex(modules, moduleId);
        if (moduleIndex < 0) {
            return;
        }

        ModuleSummary module = modules.get(moduleIndex);
        boolean isLastBlockOfModule = isLastBlockOfModule(module, contentBlockId);
        int modulesCompleted = isLastBlockOfModule ? moduleIndex + 1 : moduleIndex;
        boolean isLastModule = moduleIndex == modules.size() - 1;

        int completionPercentage;
        if (isLastBlockOfModule && isLastModule) {
            completionPercentage = 100;
        } else {
            completionPercentage = Math.min(100, (100 * modulesCompleted) / modules.size());
        }

        traineeProgressRepository.updateResumePoint(traineeId, courseId, moduleId, contentBlockId, completionPercentage);
    }

    private int findModuleIndex(List<ModuleSummary> modules, UUID moduleId) {
        for (int i = 0; i < modules.size(); i++) {
            if (modules.get(i).getId().equals(moduleId)) {
                return i;
            }
        }
        return -1;
    }

    private boolean isLastBlockOfModule(ModuleSummary module, UUID contentBlockId) {
        List<ContentBlockSummary> blocks = module.getContentBlocks();
        if (blocks.isEmpty()) {
            return true; // no blocks, consider "done" when viewing module
        }
        ContentBlockSummary lastBlock = blocks.stream()
                .max(Comparator.comparingInt(ContentBlockSummary::getBlockOrder))
                .orElse(blocks.get(blocks.size() - 1));
        return lastBlock.getId().equals(contentBlockId);
    }
}
