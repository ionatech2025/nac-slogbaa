package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.repository.JpaModuleProgressRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeProgressRepository;
import com.nac.slogbaa.shared.ports.CourseDeletionCheckPort;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CourseDeletionCheckAdapter implements CourseDeletionCheckPort {

    private final JpaTraineeProgressRepository traineeProgressRepository;
    private final JpaModuleProgressRepository moduleProgressRepository;

    public CourseDeletionCheckAdapter(JpaTraineeProgressRepository traineeProgressRepository,
                                      JpaModuleProgressRepository moduleProgressRepository) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.moduleProgressRepository = moduleProgressRepository;
    }

    @Override
    public long countEnrollmentsByCourseId(UUID courseId) {
        return traineeProgressRepository.countByCourseId(courseId);
    }

    @Override
    public long countModuleCompletionsByModuleId(UUID moduleId) {
        return moduleProgressRepository.countCompletedByModuleId(moduleId);
    }
}
