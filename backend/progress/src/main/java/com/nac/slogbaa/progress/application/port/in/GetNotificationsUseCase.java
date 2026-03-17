package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.NotificationResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Use case: retrieve paginated notifications and unread count for a trainee.
 */
public interface GetNotificationsUseCase {

    /**
     * Get paginated notifications for a trainee.
     */
    Page<NotificationResult> getNotifications(UUID traineeId, Pageable pageable);

    /**
     * Get the count of unread notifications.
     */
    long getUnreadCount(UUID traineeId);

    /**
     * Mark a single notification as read. Returns true if the notification belongs to the trainee.
     */
    boolean markAsRead(UUID traineeId, UUID notificationId);

    /**
     * Mark all notifications as read for a trainee.
     */
    void markAllAsRead(UUID traineeId);
}
