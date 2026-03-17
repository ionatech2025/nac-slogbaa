package com.nac.slogbaa.learning.adapters.persistence.repository;

import com.nac.slogbaa.learning.adapters.persistence.entity.ModuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface JpaModuleRepository extends JpaRepository<ModuleEntity, UUID> {

    List<ModuleEntity> findByCourseIdOrderByModuleOrder(UUID courseId);

    /**
     * Batch fetch module stats (count + estimated minutes) for multiple courses in one query.
     * Returns [courseId, moduleCount, estimateCount, totalEstimatedMinutes].
     */
    @Query("""
            SELECT m.course.id, COUNT(m), COUNT(m.estimatedMinutes),
                   COALESCE(SUM(m.estimatedMinutes), 0)
            FROM ModuleEntity m WHERE m.course.id IN :courseIds GROUP BY m.course.id
            """)
    List<Object[]> findModuleStatsByCourseIds(@Param("courseIds") Collection<UUID> courseIds);
}
