package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;
import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionReplyEntity;
import com.nac.slogbaa.progress.application.dto.ReplyResult;
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

    public ReplyToThreadService(DiscussionPort discussionPort,
                                GetTraineeByIdUseCase getTraineeByIdUseCase,
                                GetStaffByIdUseCase getStaffByIdUseCase) {
        this.discussionPort = discussionPort;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.getStaffByIdUseCase = getStaffByIdUseCase;
    }

    @Override
    public ReplyResult reply(UUID threadId, UUID authorId, String authorType, String body) {
        if (body == null || body.isBlank()) {
            throw new IllegalArgumentException("Reply body cannot be empty");
        }

        // Verify thread exists
        discussionPort.findThreadById(threadId)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));

        DiscussionReplyEntity entity = new DiscussionReplyEntity();
        entity.setThreadId(threadId);
        entity.setAuthorId(authorId);
        entity.setAuthorType(authorType);
        entity.setBody(body.trim());

        DiscussionReplyEntity saved = discussionPort.saveReply(entity);
        discussionPort.incrementReplyCount(threadId);

        String displayName = resolveDisplayName(authorId, authorType);

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
