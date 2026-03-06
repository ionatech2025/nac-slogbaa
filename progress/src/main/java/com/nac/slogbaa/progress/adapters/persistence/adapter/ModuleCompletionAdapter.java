package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.ModuleProgressEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeProgressEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaModuleProgressRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeProgressRepository;
import com.nac.slogbaa.progress.application.port.out.ModuleCompletionPort;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class ModuleCompletionAdapter implements ModuleCompletionPort {

    private final JpaTraineeProgressRepository traineeProgressRepository;
    private final JpaModuleProgressRepository moduleProgressRepository;

    public ModuleCompletionAdapter(JpaTraineeProgressRepository traineeProgressRepository,
                                  JpaModuleProgressRepository moduleProgressRepository) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.moduleProgressRepository = moduleProgressRepository;
    }

    @Override
    public void recordModuleCompleted(UUID traineeId, UUID courseId, UUID moduleId) {
        traineeProgressRepository.findOneByTraineeIdAndCourseId(traineeId, courseId)
                .ifPresent(progress -> {
                    moduleProgressRepository.findByTraineeProgress_IdAndModuleId(progress.getId(), moduleId)
                            .ifPresentOrElse(
                                    existing -> {
                                        if (!"COMPLETED".equals(existing.getStatus())) {
                                            existing.setStatus("COMPLETED");
                                            existing.setCompletedAt(Instant.now());
                                            moduleProgressRepository.save(existing);
                                        }
                                    },
                                    () -> {
                                        ModuleProgressEntity entity = new ModuleProgressEntity();
                                        entity.setTraineeProgress(progress);
                                        entity.setModuleId(moduleId);
                                        entity.setStatus("COMPLETED");
                                        entity.setCompletedAt(Instant.now());
                                        entity.setQuizStatus("NOT_ATTEMPTED");
                                        moduleProgressRepository.save(entity);
                                    }
                            );
                });
    }

    @Override
    public long countCompletedModules(UUID traineeId, UUID courseId) {
        return traineeProgressRepository.findOneByTraineeIdAndCourseId(traineeId, courseId)
                .map(progress -> moduleProgressRepository.countCompletedByTraineeProgressId(progress.getId()))
                .orElse(0L);
    }
}
