package com.nac.slogbaa.learning.adapters.persistence.repository;

import com.nac.slogbaa.learning.adapters.persistence.entity.ContentBlockEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaContentBlockRepository extends JpaRepository<ContentBlockEntity, UUID> {

    List<ContentBlockEntity> findByModuleIdOrderByBlockOrder(UUID moduleId);
}
