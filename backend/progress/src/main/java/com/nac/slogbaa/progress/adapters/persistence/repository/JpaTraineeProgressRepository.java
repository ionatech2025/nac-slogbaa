package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeProgressEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JpaTraineeProgressRepository extends JpaRepository<TraineeProgressEntity, UUID> {

    boolean existsByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    @Query("SELECT CASE WHEN COUNT(tp) > 0 THEN true ELSE false END FROM TraineeProgressEntity tp WHERE tp.traineeId = :traineeId AND tp.courseId = :courseId AND tp.status <> 'WITHDRAWN'")
    boolean existsActiveByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    Optional<TraineeProgressEntity> findOneByTraineeIdAndCourseId(UUID traineeId, UUID courseId);

    List<TraineeProgressEntity> findByTraineeIdOrderByEnrollmentDateDesc(UUID traineeId);

    @Query("SELECT tp FROM TraineeProgressEntity tp WHERE tp.traineeId = :traineeId AND tp.status <> 'WITHDRAWN' ORDER BY tp.enrollmentDate DESC")
    List<TraineeProgressEntity> findActiveByTraineeIdOrderByEnrollmentDateDesc(UUID traineeId);

    long countByCourseId(UUID courseId);

    List<TraineeProgressEntity> findByCourseIdOrderByEnrollmentDateDesc(UUID courseId);

    @Query("SELECT tp.traineeId, COUNT(tp) FROM TraineeProgressEntity tp WHERE tp.status = 'COMPLETED' GROUP BY tp.traineeId ORDER BY COUNT(tp) DESC")
    List<Object[]> findTopTraineesByCompletions(Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(tp) > 0 THEN true ELSE false END FROM TraineeProgressEntity tp WHERE tp.traineeId = :traineeId AND tp.courseId = :courseId AND tp.status = 'COMPLETED'")
    boolean existsCompletedByTraineeIdAndCourseId(UUID traineeId, UUID courseId);
}
