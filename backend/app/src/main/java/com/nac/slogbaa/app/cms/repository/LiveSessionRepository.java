package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.LiveSession;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiveSessionRepository extends JpaRepository<LiveSession, UUID> {
    List<LiveSession> findByActiveTrueOrderByScheduledAtDesc();
}
