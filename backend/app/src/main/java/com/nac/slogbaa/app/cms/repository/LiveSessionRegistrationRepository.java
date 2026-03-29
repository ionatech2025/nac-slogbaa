package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.LiveSessionRegistration;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiveSessionRegistrationRepository extends JpaRepository<LiveSessionRegistration, UUID> {

    boolean existsByLiveSessionIdAndTraineeId(UUID liveSessionId, UUID traineeId);

    Optional<LiveSessionRegistration> findByLiveSessionIdAndTraineeId(UUID liveSessionId, UUID traineeId);

    long countByLiveSessionId(UUID liveSessionId);

    void deleteByLiveSessionIdAndTraineeId(UUID liveSessionId, UUID traineeId);
}
