package com.nac.slogbaa.progress.application.port.in;

import java.util.UUID;

/**
 * Use case: create an in-app notification for a trainee.
 */
public interface CreateNotificationUseCase {

    /**
     * Create a notification.
     *
     * @param traineeId the recipient
     * @param type      notification type (e.g. BADGE_AWARDED, COURSE_COMPLETED, DISCUSSION_REPLY)
     * @param title     short title
     * @param message   longer message body
     * @param link      optional navigation link (relative path)
     */
    void create(UUID traineeId, String type, String title, String message, String link);
}
