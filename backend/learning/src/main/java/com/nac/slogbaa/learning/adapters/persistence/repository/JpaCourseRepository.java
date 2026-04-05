package com.nac.slogbaa.learning.adapters.persistence.repository;

import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaCourseRepository extends JpaRepository<CourseEntity, UUID> {

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "category")
    List<CourseEntity> findAll();

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "category")
    Page<CourseEntity> findAll(Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "category")
    Optional<CourseEntity> findById(UUID id);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "category")
    List<CourseEntity> findByPublishedTrue();

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "category")
    Page<CourseEntity> findByPublishedTrue(Pageable pageable);

    /**
     * Batch fetch course titles by IDs (used for prerequisite name resolution).
     * Returns [courseId, title].
     */
    @Query("SELECT c.id, c.title FROM CourseEntity c WHERE c.id IN :ids")
    List<Object[]> findTitlesByIds(@Param("ids") Collection<UUID> ids);
}
