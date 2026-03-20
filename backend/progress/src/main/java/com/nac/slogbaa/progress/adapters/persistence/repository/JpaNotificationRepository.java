package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface JpaNotificationRepository extends JpaRepository<NotificationEntity, UUID> {

    Page<NotificationEntity> findByTraineeIdOrderByCreatedAtDesc(UUID traineeId, Pageable pageable);

    @Query("SELECT COUNT(n) FROM NotificationEntity n WHERE n.traineeId = :traineeId AND n.read = false")
    long countUnreadByTraineeId(@Param("traineeId") UUID traineeId);

    @Modifying
    @Query("UPDATE NotificationEntity n SET n.read = true WHERE n.traineeId = :traineeId AND n.read = false")
    int markAllReadByTraineeId(@Param("traineeId") UUID traineeId);
}
