package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.progress.adapters.persistence.entity.NotificationEntity;
import com.nac.slogbaa.progress.application.port.in.CreateNotificationUseCase;
import com.nac.slogbaa.progress.application.port.out.NotificationPort;

import java.util.UUID;

/**
 * Application service: create an in-app notification for a trainee.
 */
public final class CreateNotificationService implements CreateNotificationUseCase {

    private final NotificationPort notificationPort;

    public CreateNotificationService(NotificationPort notificationPort) {
        this.notificationPort = notificationPort;
    }

    @Override
    public void create(UUID traineeId, String type, String title, String message, String link) {
        NotificationEntity entity = new NotificationEntity();
        entity.setTraineeId(traineeId);
        entity.setType(type);
        entity.setTitle(title);
        entity.setMessage(message);
        entity.setLink(link);
        notificationPort.save(entity);
    }
}
