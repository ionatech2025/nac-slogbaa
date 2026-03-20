package com.nac.slogbaa.progress.application.port.out;

import com.nac.slogbaa.progress.adapters.persistence.entity.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

/**
 * Port for in-app notification persistence.
 */
public interface NotificationPort {

    NotificationEntity save(NotificationEntity entity);

    Page<NotificationEntity> findByTrainee(UUID traineeId, Pageable pageable);

    long countUnread(UUID traineeId);

    Optional<NotificationEntity> findById(UUID id);

    void markAllRead(UUID traineeId);
}
