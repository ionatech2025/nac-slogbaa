package com.nac.slogbaa.learning.adapters.persistence.repository;

import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaCourseRepository extends JpaRepository<CourseEntity, UUID> {

    List<CourseEntity> findByPublishedTrue();

    Page<CourseEntity> findByPublishedTrue(Pageable pageable);
}
