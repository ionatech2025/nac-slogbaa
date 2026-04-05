package com.nac.slogbaa.learning.adapters.persistence.adapter;

import com.nac.slogbaa.learning.application.dto.result.LibraryResourceSummary;
import com.nac.slogbaa.learning.application.port.out.LibraryResourceQueryPort;
import com.nac.slogbaa.learning.adapters.persistence.entity.LibraryResourceEntity;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaLibraryResourceRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Adapter: query published library resources from JPA.
 */
@Component
public class LibraryResourceQueryAdapter implements LibraryResourceQueryPort {

    private final JpaLibraryResourceRepository jpaRepository;

    public LibraryResourceQueryAdapter(JpaLibraryResourceRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Cacheable("publishedLibrary")
    @Override
    public List<LibraryResourceSummary> findPublished() {
        return jpaRepository.findByPublishedTrue().stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    public List<LibraryResourceSummary> findPublished(List<UUID> courseIds) {
        if (courseIds == null || courseIds.isEmpty()) {
            // If no courses provided, return only general resources? 
            // Better to return only items where courseId IS NULL as requested for trainees.
            return jpaRepository.findPublishedForCourses(List.of()).stream()
                    .map(this::toSummary)
                    .toList();
        }
        return jpaRepository.findPublishedForCourses(courseIds).stream()
                .map(this::toSummary)
                .toList();
    }

    private LibraryResourceSummary toSummary(LibraryResourceEntity e) {
        return new LibraryResourceSummary(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getResourceType() != null ? e.getResourceType().name() : "DOCUMENT",
                e.getFileUrl(),
                e.getFileType(),
                e.getCourseId()
        );
    }
}
