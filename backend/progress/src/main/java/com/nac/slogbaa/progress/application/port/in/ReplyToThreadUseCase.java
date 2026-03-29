package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.ReplyResult;

import java.util.UUID;

/**
 * Use case: reply to an existing discussion thread.
 */
public interface ReplyToThreadUseCase {

    /**
     * Create a reply on a thread.
     *
     * @param threadId   the thread to reply to
     * @param authorId   the author's user id
     * @param authorType "TRAINEE" or "STAFF"
     * @param body       reply body text
     * @return the created reply result
     */
    ReplyResult reply(UUID courseId, UUID threadId, UUID authorId, String authorType, String body);
}
