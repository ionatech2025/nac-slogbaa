package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.NotificationEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaNotificationRepository;
import com.nac.slogbaa.progress.application.port.out.NotificationPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class NotificationAdapter implements NotificationPort {

    private final JpaNotificationRepository jpaRepository;

    public NotificationAdapter(JpaNotificationRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public NotificationEntity save(NotificationEntity entity) {
        return jpaRepository.save(entity);
    }

    @Override
    public Page<NotificationEntity> findByTrainee(UUID traineeId, Pageable pageable) {
        return jpaRepository.findByTraineeIdOrderByCreatedAtDesc(traineeId, pageable);
    }

    @Override
    public long countUnread(UUID traineeId) {
        return jpaRepository.countUnreadByTraineeId(traineeId);
    }

    @Override
    public Optional<NotificationEntity> findById(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    @Transactional
    public void markAllRead(UUID traineeId) {
        jpaRepository.markAllReadByTraineeId(traineeId);
    }
}
