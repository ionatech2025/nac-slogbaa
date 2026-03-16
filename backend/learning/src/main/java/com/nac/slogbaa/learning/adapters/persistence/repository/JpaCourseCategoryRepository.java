package com.nac.slogbaa.learning.adapters.persistence.repository;

import com.nac.slogbaa.learning.adapters.persistence.entity.CourseCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaCourseCategoryRepository extends JpaRepository<CourseCategoryEntity, UUID> {
}
