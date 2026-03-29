package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;
import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionReplyEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionThreadEntity;
import com.nac.slogbaa.progress.application.dto.ReplyResult;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;
import com.nac.slogbaa.progress.application.port.in.ReplyToThreadUseCase;
import com.nac.slogbaa.progress.application.port.out.DiscussionPort;

import java.util.UUID;

/**
 * Application service: create a reply and increment thread reply count.
 */
public final class ReplyToThreadService implements ReplyToThreadUseCase {

    private final DiscussionPort discussionPort;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final GetStaffByIdUseCase getStaffByIdUseCase;
    private final CreateNotificationUseCase createNotificationUseCase;

    public ReplyToThreadService(DiscussionPort discussionPort,
                                GetTraineeByIdUseCase getTraineeByIdUseCase,
                                GetStaffByIdUseCase getStaffByIdUseCase,
                                CreateNotificationUseCase createNotificationUseCase) {
        this.discussionPort = discussionPort;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.getStaffByIdUseCase = getStaffByIdUseCase;
        this.createNotificationUseCase = createNotificationUseCase;
    }

    @Override
    public ReplyResult reply(UUID courseId, UUID threadId, UUID authorId, String authorType, String body) {
        if (body == null || body.isBlank()) {
            throw new IllegalArgumentException("Reply body cannot be empty");
        }

        DiscussionThreadEntity thread = discussionPort.findThreadById(threadId)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        if (!thread.getCourseId().equals(courseId)) {
            throw new IllegalArgumentException("Thread does not belong to this course");
        }

        DiscussionReplyEntity entity = new DiscussionReplyEntity();
        entity.setThreadId(threadId);
        entity.setAuthorId(authorId);
        entity.setAuthorType(authorType);
        entity.setBody(body.trim());

        DiscussionReplyEntity saved = discussionPort.saveReply(entity);
        discussionPort.incrementReplyCount(threadId);

        String displayName = resolveDisplayName(authorId, authorType);

        try {
            if ("TRAINEE".equals(thread.getAuthorType()) && !thread.getAuthorId().equals(authorId)) {
                String threadTitle = thread.getTitle();
                if (threadTitle != null && threadTitle.length() > 60) {
                    threadTitle = threadTitle.substring(0, 57) + "...";
                }
                createNotificationUseCase.createForTrainee(
                        thread.getAuthorId(),
                        "DISCUSSION_REPLY",
                        "Reply to your question",
                        "A facilitator replied to your thread '" + threadTitle + "'",
                        "/dashboard/courses/" + thread.getCourseId()
                );
            }
        } catch (Exception ignored) {
            // Notification must never break the reply flow
        }

        return new ReplyResult(
                saved.getId(),
                saved.getThreadId(),
                displayName,
                saved.getAuthorType(),
                saved.getBody(),
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
}
