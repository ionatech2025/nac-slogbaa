package com.nac.slogbaa.iam.adapters.persistence.repository;

import com.nac.slogbaa.iam.adapters.persistence.entity.AdminActivityLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLogEntity, UUID> {
    List<AdminActivityLogEntity> findAllByOrderByCreatedAtDesc();
}
