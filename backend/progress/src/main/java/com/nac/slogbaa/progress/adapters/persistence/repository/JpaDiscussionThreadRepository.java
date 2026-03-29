package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionThreadEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface JpaDiscussionThreadRepository extends JpaRepository<DiscussionThreadEntity, UUID> {

    List<DiscussionThreadEntity> findByCourseIdOrderByCreatedAtDesc(UUID courseId);

    List<DiscussionThreadEntity> findByCourseIdAndModuleIdOrderByCreatedAtDesc(UUID courseId, UUID moduleId);

    Page<DiscussionThreadEntity> findByCourseIdOrderByCreatedAtDesc(UUID courseId, Pageable pageable);

    Page<DiscussionThreadEntity> findByCourseIdAndModuleIdOrderByCreatedAtDesc(UUID courseId, UUID moduleId, Pageable pageable);

    long countByCourseId(UUID courseId);

    long countByAuthorType(String authorType);

    @Query(value = """
            SELECT CAST(date_trunc('day', created_at AT TIME ZONE 'UTC') AS date) AS d, COUNT(*)
            FROM discussion_thread
            WHERE author_type = 'TRAINEE' AND created_at >= :since
            GROUP BY d ORDER BY d
            """, nativeQuery = true)
    List<Object[]> countTraineeThreadsPerUtcDaySince(@Param("since") Instant since);

    @Modifying
    @Query("UPDATE DiscussionThreadEntity t SET t.replyCount = t.replyCount + 1, t.updatedAt = CURRENT_TIMESTAMP WHERE t.id = :threadId")
    void incrementReplyCount(UUID threadId);
}
