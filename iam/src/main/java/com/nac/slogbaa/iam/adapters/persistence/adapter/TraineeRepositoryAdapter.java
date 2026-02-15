package com.nac.slogbaa.iam.adapters.persistence.adapter;

import com.nac.slogbaa.iam.adapters.persistence.mappers.TraineeEntityMapper;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaTraineeRepository;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.valueobject.Email;
import org.springframework.stereotype.Component;

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
}
