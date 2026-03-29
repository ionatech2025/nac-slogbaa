package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.dto.NotificationResult;
import com.nac.slogbaa.progress.application.port.in.GetNotificationsUseCase;
import com.nac.slogbaa.progress.application.port.out.NotificationPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Application service: retrieve and manage notifications for a trainee.
 */
public final class GetNotificationsService implements GetNotificationsUseCase {

    private final NotificationPort notificationPort;

    public GetNotificationsService(NotificationPort notificationPort) {
        this.notificationPort = notificationPort;
    }

    @Override
    public Page<NotificationResult> getNotifications(UUID traineeId, Pageable pageable) {
        return notificationPort.findByTrainee(traineeId, pageable)
                .map(e -> new NotificationResult(
                        e.getId(),
                        e.getType(),
                        e.getTitle(),
                        e.getMessage(),
                        e.getLink(),
                        e.isRead(),
                        e.getCreatedAt()
                ));
    }

    @Override
    public long getUnreadCount(UUID traineeId) {
        return notificationPort.countUnread(traineeId);
    }

    @Override
    public boolean markAsRead(UUID traineeId, UUID notificationId) {
        return notificationPort.findById(notificationId)
                .filter(n -> n.getTraineeId() != null && n.getTraineeId().equals(traineeId))
                .map(n -> {
                    if (!n.isRead()) {
                        n.setRead(true);
                        notificationPort.save(n);
                    }
                    return true;
                })
                .orElse(false);
    }

    @Override
    public void markAllAsRead(UUID traineeId) {
        notificationPort.markAllRead(traineeId);
    }
}
