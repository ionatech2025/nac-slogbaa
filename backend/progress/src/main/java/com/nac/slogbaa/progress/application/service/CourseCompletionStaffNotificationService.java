package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.StaffRole;
import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;

import java.util.UUID;

/**
 * Notifies all active super-admins when a trainee completes a course.
 */
public final class CourseCompletionStaffNotificationService {

    private final StaffUserRepositoryPort staffUserRepository;
    private final CreateNotificationUseCase createNotificationUseCase;
    private final CoursePublicationPort coursePublicationPort;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;

    public CourseCompletionStaffNotificationService(StaffUserRepositoryPort staffUserRepository,
                                                    CreateNotificationUseCase createNotificationUseCase,
                                                    CoursePublicationPort coursePublicationPort,
                                                    GetTraineeByIdUseCase getTraineeByIdUseCase) {
        this.staffUserRepository = staffUserRepository;
        this.createNotificationUseCase = createNotificationUseCase;
        this.coursePublicationPort = coursePublicationPort;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
    }

    public void notifyCourseCompleted(UUID traineeId, UUID courseId) {
        String courseName = coursePublicationPort.getCourseTitle(courseId).orElse("A course");
        TraineeDetails trainee = getTraineeByIdUseCase.getById(traineeId).orElse(null);
        String traineeName = trainee != null ? trainee.getFirstName() + " " + trainee.getLastName() : "A trainee";

        String title = "Course Completion";
        String message = traineeName + " has completed the course \"" + courseName + "\".";
        String link = "/admin/users/trainee/" + traineeId;

        // Notify Super Admins
        for (StaffUser u : staffUserRepository.findAllByRole(StaffRole.SUPER_ADMIN)) {
            if (!u.isActive()) continue;
            try {
                createNotificationUseCase.createForStaff(
                        u.getId().getValue(),
                        "COURSE_COMPLETED_BY_TRAINEE",
                        title,
                        message,
                        link
                );
            } catch (Exception ignored) {
                // notifications must not break graduation flow
            }
        }
    }
}
