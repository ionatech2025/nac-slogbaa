package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;
import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.StaffRole;
import com.nac.slogbaa.learning.application.port.out.CoursePublicationPort;
import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionThreadEntity;
import com.nac.slogbaa.progress.application.dto.ThreadResult;
import com.nac.slogbaa.progress.application.port.in.CreateDiscussionThreadUseCase;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;
import com.nac.slogbaa.progress.application.port.out.DiscussionPort;

import java.util.UUID;

/**
 * Application service: create a discussion thread with author info.
 */
public final class CreateDiscussionThreadService implements CreateDiscussionThreadUseCase {

    private final DiscussionPort discussionPort;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final GetStaffByIdUseCase getStaffByIdUseCase;
    private final CreateNotificationUseCase createNotificationUseCase;
    private final StaffUserRepositoryPort staffUserRepositoryPort;
    private final CoursePublicationPort coursePublicationPort;

    public CreateDiscussionThreadService(DiscussionPort discussionPort,
                                         GetTraineeByIdUseCase getTraineeByIdUseCase,
                                         GetStaffByIdUseCase getStaffByIdUseCase,
                                         CreateNotificationUseCase createNotificationUseCase,
                                         StaffUserRepositoryPort staffUserRepositoryPort,
                                         CoursePublicationPort coursePublicationPort) {
        this.discussionPort = discussionPort;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.getStaffByIdUseCase = getStaffByIdUseCase;
        this.createNotificationUseCase = createNotificationUseCase;
        this.staffUserRepositoryPort = staffUserRepositoryPort;
        this.coursePublicationPort = coursePublicationPort;
    }

    @Override
    public ThreadResult create(UUID courseId, UUID moduleId, UUID authorId, String authorType,
                               String title, String body) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Thread title cannot be empty");
        }
        if (body == null || body.isBlank()) {
            throw new IllegalArgumentException("Thread body cannot be empty");
        }

        DiscussionThreadEntity entity = new DiscussionThreadEntity();
        entity.setCourseId(courseId);
        entity.setModuleId(moduleId);
        entity.setAuthorId(authorId);
        entity.setAuthorType(authorType);
        entity.setTitle(title.trim());
        entity.setBody(body.trim());

        DiscussionThreadEntity saved = discussionPort.saveThread(entity);
        String displayName = resolveDisplayName(authorId, authorType);

        if ("TRAINEE".equals(authorType)) {
            try {
                String courseName = coursePublicationPort.getCourseTitle(courseId).orElse("A course");
                String shortTitle = title.trim().length() > 60 ? title.trim().substring(0, 57) + "..." : title.trim();
                for (StaffUser u : staffUserRepositoryPort.findAll()) {
                    if (!u.isActive() || u.getStaffRole() != StaffRole.SUPER_ADMIN) continue;
                    createNotificationUseCase.createForStaff(
                            u.getId().getValue(),
                            "DISCUSSION_QUESTION",
                            "New course question",
                            "A trainee asked \"" + shortTitle + "\" on \"" + courseName + "\"",
                            "/admin/learning/" + courseId
                    );
                }
            } catch (Exception ignored) {
                // notifications must not break thread creation
            }
        }

        return new ThreadResult(
                saved.getId(),
                saved.getCourseId(),
                saved.getModuleId(),
                displayName,
                saved.getAuthorType(),
                saved.getTitle(),
                saved.getBody(),
                saved.isResolved(),
                saved.getReplyCount(),
                saved.getCreatedAt()
        );
    }

    private String resolveDisplayName(UUID authorId, String authorType) {
        if ("TRAINEE".equals(authorType)) {
            return getTraineeByIdUseCase.getById(authorId)
                    .map(CreateDiscussionThreadService::formatTraineeDisplayName)
                    .orElse("Trainee");
        } else {
            return getStaffByIdUseCase.getById(authorId)
                    .map(StaffDetailsDto::getFullName)
                    .orElse("Staff");
        }
    }

    /** Format as "First L." for privacy (first name + last initial). */
    static String formatTraineeDisplayName(TraineeDetails details) {
        String first = details.getFirstName();
        String last = details.getLastName();
        if (first == null || first.isBlank()) return "Trainee";
        if (last == null || last.isBlank()) return first.trim();
        return first.trim() + " " + last.trim().charAt(0) + ".";
    }
}
