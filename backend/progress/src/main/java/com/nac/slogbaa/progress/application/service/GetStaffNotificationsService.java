package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.application.dto.NotificationResult;
import com.nac.slogbaa.progress.application.port.in.GetStaffNotificationsUseCase;
import com.nac.slogbaa.progress.application.port.out.NotificationPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public final class GetStaffNotificationsService implements GetStaffNotificationsUseCase {

    private final NotificationPort notificationPort;

    public GetStaffNotificationsService(NotificationPort notificationPort) {
        this.notificationPort = notificationPort;
    }

    @Override
    public Page<NotificationResult> listForStaff(UUID staffUserId, Pageable pageable) {
        return notificationPort.findByStaffUser(staffUserId, pageable)
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
    public long unreadCountForStaff(UUID staffUserId) {
        return notificationPort.countUnreadStaff(staffUserId);
    }

    @Override
    public boolean markStaffNotificationRead(UUID staffUserId, UUID notificationId) {
        return notificationPort.findById(notificationId)
                .filter(n -> n.getStaffUserId() != null && n.getStaffUserId().equals(staffUserId))
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
    public void markAllStaffNotificationsRead(UUID staffUserId) {
        notificationPort.markAllReadStaff(staffUserId);
    }
}
