package com.nac.slogbaa.learning.adapters.persistence.adapter;

import com.nac.slogbaa.learning.application.dto.command.CreateLibraryResourceCommand;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceWritePort;
import com.nac.slogbaa.learning.adapters.persistence.entity.LibraryResourceEntity;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaLibraryResourceRepository;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Adapter: create and update library resources via JPA.
 */
@Component
public class LibraryResourceWriteAdapter implements LibraryResourceWritePort {

    private final JpaLibraryResourceRepository jpaRepository;

    public LibraryResourceWriteAdapter(JpaLibraryResourceRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public UUID create(CreateLibraryResourceCommand command) {
        LibraryResourceEntity e = new LibraryResourceEntity();
        e.setId(UUID.randomUUID());
        e.setTitle(command.getTitle());
        e.setDescription(command.getDescription());
        try {
            e.setResourceType(LibraryResourceEntity.ResourceTypeEnum.valueOf(
                    command.getResourceType().toUpperCase().replace('-', '_')));
        } catch (IllegalArgumentException ex) {
            e.setResourceType(LibraryResourceEntity.ResourceTypeEnum.DOCUMENT);
        }
        e.setFileUrl(command.getFileUrl());
        e.setFileType(command.getFileType());
        e.setUploadedBy(command.getUploadedBy());
        e.setPublished(false);
        Instant now = Instant.now();
        e.setCreatedAt(now);
        e.setUpdatedAt(now);
        e.setUploadedAt(now);
        jpaRepository.save(e);
        return e.getId();
    }

    @Override
    public void setPublished(UUID resourceId, boolean published) {
        LibraryResourceEntity e = jpaRepository.findById(resourceId).orElseThrow();
        e.setPublished(published);
        jpaRepository.save(e);
    }

    @Override
    public Optional<LibraryResourceRecord> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toRecord);
    }

    @Override
    public List<LibraryResourceRecord> findAll() {
        return jpaRepository.findAll().stream().map(this::toRecord).toList();
    }

    private LibraryResourceRecord toRecord(LibraryResourceEntity e) {
        return new LibraryResourceRecord(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getResourceType() != null ? e.getResourceType().name() : "DOCUMENT",
                e.getFileUrl(),
                e.getFileType(),
                e.getUploadedBy(),
                e.isPublished()
        );
    }
}
