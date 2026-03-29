package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.NotificationResult;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GetStaffNotificationsUseCase {

    Page<NotificationResult> listForStaff(UUID staffUserId, Pageable pageable);

    long unreadCountForStaff(UUID staffUserId);

    boolean markStaffNotificationRead(UUID staffUserId, UUID notificationId);

    void markAllStaffNotificationsRead(UUID staffUserId);
}
