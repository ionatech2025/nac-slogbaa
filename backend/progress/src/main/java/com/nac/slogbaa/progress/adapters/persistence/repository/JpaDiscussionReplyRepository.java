package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaDiscussionReplyRepository extends JpaRepository<DiscussionReplyEntity, UUID> {

    List<DiscussionReplyEntity> findByThreadIdOrderByCreatedAtAsc(UUID threadId);
}
