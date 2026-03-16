package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionReplyEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionThreadEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port for discussion thread and reply persistence.
 */
public interface DiscussionPort {

    DiscussionThreadEntity saveThread(DiscussionThreadEntity entity);

    DiscussionReplyEntity saveReply(DiscussionReplyEntity entity);

    List<DiscussionThreadEntity> findThreadsByCourse(UUID courseId);

    List<DiscussionThreadEntity> findThreadsByCourseAndModule(UUID courseId, UUID moduleId);

    Optional<DiscussionThreadEntity> findThreadById(UUID threadId);

    List<DiscussionReplyEntity> findRepliesByThread(UUID threadId);

    void markResolved(UUID threadId);

    void deleteThread(UUID threadId);

    void deleteReply(UUID replyId);

    void incrementReplyCount(UUID threadId);
}
