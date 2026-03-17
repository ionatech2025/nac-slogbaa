package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionThreadEntity;
import com.nac.slogbaa.progress.application.port.in.ResolveThreadUseCase;
import com.nac.slogbaa.progress.application.port.out.DiscussionPort;

import java.util.UUID;

/**
 * Application service: mark a discussion thread as resolved.
 * Only the original author or staff (ADMIN/SUPER_ADMIN) may resolve.
 */
public final class ResolveThreadService implements ResolveThreadUseCase {

    private final DiscussionPort discussionPort;

    public ResolveThreadService(DiscussionPort discussionPort) {
        this.discussionPort = discussionPort;
    }

    @Override
    public void resolve(UUID threadId, UUID requesterId, boolean isStaff) {
        DiscussionThreadEntity thread = discussionPort.findThreadById(threadId)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));

        boolean isAuthor = thread.getAuthorId().equals(requesterId);
        if (!isAuthor && !isStaff) {
            throw new SecurityException("Only the thread author or staff can resolve a thread");
        }

        discussionPort.markResolved(threadId);
    }
}
