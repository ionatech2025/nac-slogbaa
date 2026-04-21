package com.nac.slogbaa.app.cms.repository;

import com.nac.slogbaa.app.cms.entity.InPersonTraining;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InPersonTrainingRepository extends JpaRepository<InPersonTraining, UUID> {
    List<InPersonTraining> findByActiveTrueOrderByEventDateDesc();
}
