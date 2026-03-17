package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.learning.application.port.out.CourseDetailsQueryPort;
import com.nac.slogbaa.progress.application.port.in.CheckAndAwardBadgesUseCase;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;
import com.nac.slogbaa.progress.application.port.in.IssueCertificateUseCase;
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
    private final IssueCertificateUseCase issueCertificateUseCase;
    private final CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase;
    private final CreateNotificationUseCase createNotificationUseCase;

    public RecordModuleCompletionService(TraineeProgressRepositoryPort traineeProgressRepository,
                                         ModuleCompletionPort moduleCompletionPort,
                                         CourseDetailsQueryPort courseDetailsQueryPort,
                                         IssueCertificateUseCase issueCertificateUseCase,
                                         CheckAndAwardBadgesUseCase checkAndAwardBadgesUseCase,
                                         CreateNotificationUseCase createNotificationUseCase) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.moduleCompletionPort = moduleCompletionPort;
        this.courseDetailsQueryPort = courseDetailsQueryPort;
        this.issueCertificateUseCase = issueCertificateUseCase;
        this.checkAndAwardBadgesUseCase = checkAndAwardBadgesUseCase;
        this.createNotificationUseCase = createNotificationUseCase;
    }

    @Override
    public void record(UUID traineeId, UUID courseId, UUID moduleId, boolean quizPassed) {
        if (!traineeProgressRepository.existsByTraineeIdAndCourseId(traineeId, courseId)) {
            return;
        }

        moduleCompletionPort.recordModuleCompleted(traineeId, courseId, moduleId, quizPassed);

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

        if (allComplete) {
            try {
                issueCertificateUseCase.issueIfEligible(traineeId, courseId);
            } catch (Exception ignored) {
            }
            try {
                checkAndAwardBadgesUseCase.checkAndAward(traineeId, "FIRST_COMPLETION");
                checkAndAwardBadgesUseCase.checkAndAward(traineeId, "COURSES_COMPLETED_3");
                checkAndAwardBadgesUseCase.checkAndAward(traineeId, "COURSES_COMPLETED_5");
            } catch (Exception ignored) {
                // Badge checks must never break the main completion flow
            }
            try {
                String courseTitle = courseDetailsQueryPort.findCourseDetailsById(courseId)
                        .map(c -> c.getTitle())
                        .orElse("a course");
                createNotificationUseCase.create(
                        traineeId,
                        "COURSE_COMPLETED",
                        "Course Completed!",
                        "Congratulations! You completed '" + courseTitle + "'",
                        "/dashboard/courses/" + courseId
                );
            } catch (Exception ignored) {
                // Notification must never break the main completion flow
            }
        }
    }
}
