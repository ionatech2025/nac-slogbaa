package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionThreadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface JpaDiscussionThreadRepository extends JpaRepository<DiscussionThreadEntity, UUID> {

    List<DiscussionThreadEntity> findByCourseIdOrderByCreatedAtDesc(UUID courseId);

    List<DiscussionThreadEntity> findByCourseIdAndModuleIdOrderByCreatedAtDesc(UUID courseId, UUID moduleId);

    long countByCourseId(UUID courseId);

    @Modifying
    @Query("UPDATE DiscussionThreadEntity t SET t.replyCount = t.replyCount + 1, t.updatedAt = CURRENT_TIMESTAMP WHERE t.id = :threadId")
    void incrementReplyCount(UUID threadId);
}
