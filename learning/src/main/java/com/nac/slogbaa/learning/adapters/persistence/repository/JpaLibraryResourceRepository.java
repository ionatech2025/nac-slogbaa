package com.nac.slogbaa.learning.adapters.persistence.repository;

import com.nac.slogbaa.learning.adapters.persistence.entity.LibraryResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaLibraryResourceRepository extends JpaRepository<LibraryResourceEntity, UUID> {

    List<LibraryResourceEntity> findByIsPublishedTrue();
}
