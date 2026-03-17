package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.StaffDetailsDto;
import com.nac.slogbaa.iam.application.port.in.GetStaffByIdUseCase;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionReplyEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionThreadEntity;
import com.nac.slogbaa.progress.application.dto.ReplyResult;
import com.nac.slogbaa.progress.application.dto.ThreadResult;
import com.nac.slogbaa.progress.application.port.in.GetDiscussionThreadsUseCase;
import com.nac.slogbaa.progress.application.port.out.DiscussionPort;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Application service: retrieve discussion threads with author display names.
 * Optionally filtered by moduleId.
 */
public final class GetDiscussionThreadsService implements GetDiscussionThreadsUseCase {

    private final DiscussionPort discussionPort;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;
    private final GetStaffByIdUseCase getStaffByIdUseCase;

    public GetDiscussionThreadsService(DiscussionPort discussionPort,
                                       GetTraineeByIdUseCase getTraineeByIdUseCase,
                                       GetStaffByIdUseCase getStaffByIdUseCase) {
        this.discussionPort = discussionPort;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
        this.getStaffByIdUseCase = getStaffByIdUseCase;
    }

    @Override
    public List<ThreadResult> getThreads(UUID courseId, UUID moduleId) {
        List<DiscussionThreadEntity> threads;
        if (moduleId != null) {
            threads = discussionPort.findThreadsByCourseAndModule(courseId, moduleId);
        } else {
            threads = discussionPort.findThreadsByCourse(courseId);
        }
        return threads.stream().map(this::toThreadResult).toList();
    }

    @Override
    public Page<ThreadResult> getThreads(UUID courseId, UUID moduleId, Pageable pageable) {
        Page<DiscussionThreadEntity> threads;
        if (moduleId != null) {
            threads = discussionPort.findThreadsByCourseAndModule(courseId, moduleId, pageable);
        } else {
            threads = discussionPort.findThreadsByCourse(courseId, pageable);
        }
        return threads.map(this::toThreadResult);
    }

    @Override
    public ThreadResult getThread(UUID threadId) {
        DiscussionThreadEntity entity = discussionPort.findThreadById(threadId)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        return toThreadResult(entity);
    }

    @Override
    public List<ReplyResult> getReplies(UUID threadId) {
        return discussionPort.findRepliesByThread(threadId).stream()
                .map(this::toReplyResult)
                .toList();
    }

    private ThreadResult toThreadResult(DiscussionThreadEntity entity) {
        String displayName = resolveDisplayName(entity.getAuthorId(), entity.getAuthorType());
        return new ThreadResult(
                entity.getId(),
                entity.getCourseId(),
                entity.getModuleId(),
                displayName,
                entity.getAuthorType(),
                entity.getTitle(),
                entity.getBody(),
                entity.isResolved(),
                entity.getReplyCount(),
                entity.getCreatedAt()
        );
    }

    private ReplyResult toReplyResult(DiscussionReplyEntity entity) {
        String displayName = resolveDisplayName(entity.getAuthorId(), entity.getAuthorType());
        return new ReplyResult(
                entity.getId(),
                entity.getThreadId(),
                displayName,
                entity.getAuthorType(),
                entity.getBody(),
                entity.getCreatedAt()
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
