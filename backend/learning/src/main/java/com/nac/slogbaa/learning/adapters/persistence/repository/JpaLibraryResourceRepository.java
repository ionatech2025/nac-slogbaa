package com.nac.slogbaa.learning.adapters.persistence.repository;

import com.nac.slogbaa.learning.adapters.persistence.entity.LibraryResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface JpaLibraryResourceRepository extends JpaRepository<LibraryResourceEntity, UUID> {

    List<LibraryResourceEntity> findByPublishedTrue();

    @Query("SELECT l FROM LibraryResourceEntity l WHERE l.published = true AND (l.courseId IS NULL OR l.courseId IN :courseIds)")
    List<LibraryResourceEntity> findPublishedForCourses(@Param("courseIds") List<UUID> courseIds);
}
