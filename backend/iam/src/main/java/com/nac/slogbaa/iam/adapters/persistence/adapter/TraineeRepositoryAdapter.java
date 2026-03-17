package com.nac.slogbaa.iam.adapters.persistence.adapter;

import com.nac.slogbaa.iam.adapters.persistence.mappers.TraineeEntityMapper;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaTraineeRepository;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.valueobject.Email;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Component
public class TraineeRepositoryAdapter implements TraineeRepositoryPort {

    private final JpaTraineeRepository jpaRepository;
    private final TraineeEntityMapper mapper;

    public TraineeRepositoryAdapter(JpaTraineeRepository jpaRepository, TraineeEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Trainee save(Trainee trainee) {
        var entity = mapper.toEntity(trainee);
        entity = jpaRepository.save(entity);
        return mapper.toDomain(entity);
    }

    @Override
    public Optional<Trainee> findByEmail(Email email) {
        return jpaRepository.findByEmail(email.getValue()).map(mapper::toDomain);
    }

    @Override
    public Optional<Trainee> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Trainee> findAll() {
        return StreamSupport.stream(jpaRepository.findAll().spliterator(), false)
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public void updatePasswordHash(UUID traineeId, String newPasswordHash) {
        jpaRepository.findById(traineeId).ifPresent(entity -> {
            entity.setPasswordHash(newPasswordHash);
            jpaRepository.save(entity);
        });
    }

    @Override
    public void setEmailVerified(UUID traineeId, boolean verified) {
        jpaRepository.findById(traineeId).ifPresent(entity -> {
            entity.setEmailVerified(verified);
            jpaRepository.save(entity);
        });
    }

    @Override
    public void softDelete(UUID traineeId, String reason) {
        jpaRepository.findById(traineeId).ifPresent(entity -> {
            entity.setActive(false);
            entity.setDeletedAt(Instant.now());
            entity.setDeletionReason(reason);
            jpaRepository.save(entity);
        });
    }

    @Override
    public void updateProfileImage(UUID traineeId, String profileImageUrl) {
        jpaRepository.findById(traineeId).ifPresent(entity -> {
            entity.setProfileImageUrl(profileImageUrl);
            jpaRepository.save(entity);
        });
    }
}
