package com.nac.slogbaa.learning.adapters.persistence.repository;

import com.nac.slogbaa.learning.adapters.persistence.entity.ModuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaModuleRepository extends JpaRepository<ModuleEntity, UUID> {

    List<ModuleEntity> findByCourseIdOrderByModuleOrder(UUID courseId);
}
