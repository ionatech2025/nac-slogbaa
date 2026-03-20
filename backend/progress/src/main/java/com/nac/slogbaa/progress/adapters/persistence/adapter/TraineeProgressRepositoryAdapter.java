package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeProgressEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeProgressRepository;
import com.nac.slogbaa.progress.application.dto.ResumePoint;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;
import com.nac.slogbaa.progress.core.aggregate.TraineeProgress;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class TraineeProgressRepositoryAdapter implements TraineeProgressRepositoryPort {

    private final JpaTraineeProgressRepository jpaRepository;

    public TraineeProgressRepositoryAdapter(JpaTraineeProgressRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public TraineeProgress save(TraineeProgress progress) {
        TraineeProgressEntity entity = toEntity(progress);
        entity = jpaRepository.save(entity);
        return toDomain(entity);
    }

    @Override
    public boolean existsByTraineeIdAndCourseId(UUID traineeId, UUID courseId) {
        return jpaRepository.existsActiveByTraineeIdAndCourseId(traineeId, courseId);
    }

    @Override
    public List<TraineeProgress> findByTraineeId(UUID traineeId) {
        return jpaRepository.findActiveByTraineeIdOrderByEnrollmentDateDesc(traineeId).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<ResumePoint> findResumePoint(UUID traineeId, UUID courseId) {
        return jpaRepository.findOneByTraineeIdAndCourseId(traineeId, courseId)
                .filter(e -> e.getLastModuleId() != null)
                .map(e -> new ResumePoint(e.getLastModuleId(), e.getLastContentBlockId()));
    }

    @Override
    public void updateResumePoint(UUID traineeId, UUID courseId, UUID lastModuleId, UUID lastContentBlockId, int completionPercentage) {
        jpaRepository.findOneByTraineeIdAndCourseId(traineeId, courseId)
                .ifPresent(entity -> {
                    entity.setLastModuleId(lastModuleId);
                    entity.setLastContentBlockId(lastContentBlockId);
                    entity.setLastAccessedAt(java.time.Instant.now());
                    entity.setCompletionPercentage(Math.max(0, Math.min(100, completionPercentage)));
                    jpaRepository.save(entity);
                });
    }

    @Override
    public void updateCompletionStatus(UUID traineeId, UUID courseId, String status, int completionPercentage) {
        jpaRepository.findOneByTraineeIdAndCourseId(traineeId, courseId)
                .ifPresent(entity -> {
                    entity.setStatus(status);
                    entity.setCompletionPercentage(Math.max(0, Math.min(100, completionPercentage)));
                    jpaRepository.save(entity);
                });
    }

    @Override
    public List<Map.Entry<UUID, Long>> findTopTraineesByCompletions(int limit) {
        List<Object[]> rows = jpaRepository.findTopTraineesByCompletions(PageRequest.of(0, limit));
        List<Map.Entry<UUID, Long>> result = new ArrayList<>();
        for (Object[] row : rows) {
            UUID traineeId = (UUID) row[0];
            long count = ((Number) row[1]).longValue();
            result.add(Map.entry(traineeId, count));
        }
        return result;
    }

    @Override
    public boolean hasCompletedCourse(UUID traineeId, UUID courseId) {
        return jpaRepository.existsCompletedByTraineeIdAndCourseId(traineeId, courseId);
    }

    @Override
    public boolean reactivateIfWithdrawn(UUID traineeId, UUID courseId) {
        Optional<TraineeProgressEntity> opt = jpaRepository.findOneByTraineeIdAndCourseId(traineeId, courseId);
        if (opt.isPresent() && "WITHDRAWN".equals(opt.get().getStatus())) {
            TraineeProgressEntity entity = opt.get();
            entity.setStatus("IN_PROGRESS");
            jpaRepository.save(entity);
            return true;
        }
        return false;
    }

    private TraineeProgressEntity toEntity(TraineeProgress domain) {
        TraineeProgressEntity e = new TraineeProgressEntity();
        e.setId(domain.getId());
        e.setTraineeId(domain.getTraineeId());
        e.setCourseId(domain.getCourseId());
        e.setEnrollmentDate(domain.getEnrollmentDate());
        e.setStatus(domain.getStatus());
        e.setCompletionPercentage(domain.getCompletionPercentage());
        return e;
    }

    private TraineeProgress toDomain(TraineeProgressEntity entity) {
        return new TraineeProgress(
                entity.getId(),
                entity.getTraineeId(),
                entity.getCourseId(),
                entity.getEnrollmentDate(),
                entity.getStatus(),
                entity.getCompletionPercentage()
        );
    }
}
