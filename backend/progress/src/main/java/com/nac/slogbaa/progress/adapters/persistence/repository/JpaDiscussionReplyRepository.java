package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface JpaDiscussionReplyRepository extends JpaRepository<DiscussionReplyEntity, UUID> {

    List<DiscussionReplyEntity> findByThreadIdOrderByCreatedAtAsc(UUID threadId);

    @Query(value = """
            SELECT CAST(date_trunc('day', created_at AT TIME ZONE 'UTC') AS date) AS d, COUNT(*)
            FROM discussion_reply
            WHERE created_at >= :since
            GROUP BY d ORDER BY d
            """, nativeQuery = true)
    List<Object[]> countPerUtcDaySince(@Param("since") Instant since);
}
