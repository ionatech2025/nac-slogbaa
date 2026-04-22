package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.PublicLibraryResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PublicLibraryResourceRepository extends JpaRepository<PublicLibraryResource, UUID> {
    List<PublicLibraryResource> findByActiveTrueOrderBySortOrderAsc();
}
