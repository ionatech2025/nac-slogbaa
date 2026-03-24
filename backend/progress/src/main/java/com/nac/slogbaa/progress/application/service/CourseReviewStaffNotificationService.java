package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.StaffRole;
import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;

import java.util.UUID;

/**
 * Notifies all active admins and super-admins when a course review is submitted.
 */
public final class CourseReviewStaffNotificationService {

    private final StaffUserRepositoryPort staffUserRepository;
    private final CreateNotificationUseCase createNotificationUseCase;
    private final CoursePublicationPort coursePublicationPort;

    public CourseReviewStaffNotificationService(StaffUserRepositoryPort staffUserRepository,
                                                CreateNotificationUseCase createNotificationUseCase,
                                                CoursePublicationPort coursePublicationPort) {
        this.staffUserRepository = staffUserRepository;
        this.createNotificationUseCase = createNotificationUseCase;
        this.coursePublicationPort = coursePublicationPort;
    }

    /**
     * @param excludeStaffUserId optional staff id to skip (the reviewer, when staff submitted)
     */
    public void notifyReviewSubmitted(UUID courseId, UUID excludeStaffUserId) {
        String courseName = coursePublicationPort.getCourseTitle(courseId).orElse("A course");
        String title = "New course review";
        String message = "A new review was submitted for \"" + courseName + "\".";
        String link = "/admin/learning/" + courseId;
        for (StaffUser u : staffUserRepository.findAll()) {
            if (!u.isActive()) continue;
            if (u.getStaffRole() != StaffRole.ADMIN && u.getStaffRole() != StaffRole.SUPER_ADMIN) continue;
            if (excludeStaffUserId != null && u.getId().getValue().equals(excludeStaffUserId)) continue;
            try {
                createNotificationUseCase.createForStaff(
                        u.getId().getValue(),
                        "COURSE_REVIEW_SUBMITTED",
                        title,
                        message,
                        link
                );
            } catch (Exception ignored) {
                // notifications must not break review flow
            }
        }
    }
}
