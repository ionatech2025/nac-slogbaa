package com.nac.slogbaa.iam.adapters.persistence.repository;

import com.nac.slogbaa.iam.adapters.persistence.entity.TraineeEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JpaTraineeRepository extends JpaRepository<TraineeEntity, UUID> {

    Optional<TraineeEntity> findByEmail(String email);

    @Query("select t.id from TraineeEntity t where t.active = true")
    List<UUID> findAllActiveTraineeIds();

    @Query("SELECT t.gender, COUNT(t) FROM TraineeEntity t GROUP BY t.gender")
    List<Object[]> countByGender();

    @Query("SELECT t.districtName, COUNT(t) FROM TraineeEntity t GROUP BY t.districtName")
    List<Object[]> countByDistrict();

    @Query("SELECT COUNT(DISTINCT t.districtName) FROM TraineeEntity t")
    long countDistinctDistrictName();
}
