package com.nac.slogbaa.progress.adapters.persistence.repository;

import com.nac.slogbaa.progress.adapters.persistence.entity.DailyActivityEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaDailyActivityRepository extends JpaRepository<DailyActivityEntity, UUID> {

    Optional<DailyActivityEntity> findByTraineeIdAndActivityDate(UUID traineeId, LocalDate activityDate);

    List<DailyActivityEntity> findByTraineeIdOrderByActivityDateDesc(UUID traineeId);
}
