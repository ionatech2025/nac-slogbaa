package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.dto.result.CourseSummary;
import com.nac.slogbaa.learning.application.port.out.CourseSummaryQueryPort;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;

import java.util.List;
import java.util.UUID;

/**
 * Returns course summaries for all courses the trainee is enrolled in.
 */
public final class GetEnrolledCoursesService implements GetEnrolledCoursesUseCase {

    private final TraineeProgressRepositoryPort traineeProgressRepository;
    private final CourseSummaryQueryPort courseSummaryQueryPort;

    public GetEnrolledCoursesService(TraineeProgressRepositoryPort traineeProgressRepository,
                                    CourseSummaryQueryPort courseSummaryQueryPort) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.courseSummaryQueryPort = courseSummaryQueryPort;
    }

    @Override
    public List<CourseSummary> getEnrolledCourses(UUID traineeId) {
        return traineeProgressRepository.findByTraineeId(traineeId).stream()
                .map(p -> courseSummaryQueryPort.getSummaryByCourseId(p.getCourseId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .toList();
    }
}
