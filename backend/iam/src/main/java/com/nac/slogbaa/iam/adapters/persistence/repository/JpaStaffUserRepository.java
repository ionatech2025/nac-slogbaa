package com.nac.slogbaa.iam.adapters.persistence.repository;

import com.nac.slogbaa.iam.adapters.persistence.entity.StaffUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaStaffUserRepository extends JpaRepository<StaffUserEntity, UUID> {

    Optional<StaffUserEntity> findByEmail(String email);

    long countByStaffRole(StaffUserEntity.StaffRoleEnum staffRole);
}
