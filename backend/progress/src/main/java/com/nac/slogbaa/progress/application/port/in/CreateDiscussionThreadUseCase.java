package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.ThreadResult;

import java.util.UUID;

/**
 * Use case: create a new discussion thread for a course.
 */
public interface CreateDiscussionThreadUseCase {

    /**
     * Create a discussion thread.
     *
     * @param courseId  the course this thread belongs to
     * @param moduleId optional module scope (may be null)
     * @param authorId the author's user id
     * @param authorType "TRAINEE" or "STAFF"
     * @param title    thread title
     * @param body     thread body text
     * @return the created thread result
     */
    ThreadResult create(UUID courseId, UUID moduleId, UUID authorId, String authorType,
                        String title, String body);
}
