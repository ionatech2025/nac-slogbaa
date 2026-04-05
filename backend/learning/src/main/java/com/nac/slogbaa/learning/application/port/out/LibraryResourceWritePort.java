package com.nac.slogbaa.learning.application.port.out;

import com.nac.slogbaa.learning.application.dto.command.CreateLibraryResourceCommand;
import com.nac.slogbaa.learning.application.dto.command.UpdateLibraryResourceCommand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port for creating and updating library resources.
 */
public interface LibraryResourceWritePort {

    UUID create(CreateLibraryResourceCommand command);

    void update(UUID resourceId, UpdateLibraryResourceCommand command);

    void setPublished(UUID resourceId, boolean published);

    Optional<LibraryResourceRecord> findById(UUID id);

    List<LibraryResourceRecord> findAll();

    Page<LibraryResourceRecord> findAll(Pageable pageable);

    record LibraryResourceRecord(UUID id, String title, String description, String resourceType,
                                 String fileUrl, String fileType, UUID uploadedBy, boolean published, UUID courseId) {}
}
