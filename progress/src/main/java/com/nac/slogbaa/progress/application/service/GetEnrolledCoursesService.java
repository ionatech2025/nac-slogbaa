package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.dto.result.CourseSummary;
import com.nac.slogbaa.learning.application.port.out.CourseSummaryQueryPort;
import com.nac.slogbaa.progress.application.dto.EnrolledCourseResult;
import com.nac.slogbaa.progress.application.port.in.GetEnrolledCoursesUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.core.aggregate.TraineeProgress;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Returns enrolled courses with progress (completion percentage) for a trainee.
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
    public List<EnrolledCourseResult> getEnrolledCourses(UUID traineeId) {
        List<EnrolledCourseResult> result = new ArrayList<>();
        for (TraineeProgress progress : traineeProgressRepository.findByTraineeId(traineeId)) {
            Optional<CourseSummary> summary = courseSummaryQueryPort.getSummaryByCourseId(progress.getCourseId());
            if (summary.isEmpty()) continue;
            CourseSummary s = summary.get();
            result.add(new EnrolledCourseResult(
                    s.getId(),
                    s.getTitle(),
                    s.getDescription(),
                    s.getImageUrl(),
                    s.getModuleCount(),
                    progress.getCompletionPercentage()
            ));
        }
        return result;
    }
}
