package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.ReplyResult;
import com.nac.slogbaa.progress.application.dto.ThreadResult;

import java.util.List;
import java.util.UUID;

/**
 * Use case: retrieve discussion threads and replies for a course.
 */
public interface GetDiscussionThreadsUseCase {

    /**
     * Get threads for a course, optionally filtered by module.
     */
    List<ThreadResult> getThreads(UUID courseId, UUID moduleId);

    /**
     * Get a single thread by id with its details.
     */
    ThreadResult getThread(UUID threadId);

    /**
     * Get all replies for a thread.
     */
    List<ReplyResult> getReplies(UUID threadId);
}
