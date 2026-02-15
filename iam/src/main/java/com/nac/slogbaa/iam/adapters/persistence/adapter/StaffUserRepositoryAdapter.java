package com.nac.slogbaa.iam.adapters.persistence.adapter;

import com.nac.slogbaa.iam.adapters.persistence.mappers.StaffUserEntityMapper;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaStaffUserRepository;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Component
public class StaffUserRepositoryAdapter implements StaffUserRepositoryPort {

    private final JpaStaffUserRepository jpaRepository;
    private final StaffUserEntityMapper mapper;

    public StaffUserRepositoryAdapter(JpaStaffUserRepository jpaRepository, StaffUserEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<StaffUser> findByEmail(Email email) {
        return jpaRepository.findByEmail(email.getValue()).map(mapper::toDomain);
    }

    @Override
    public Optional<StaffUser> findById(StaffUserId id) {
        return jpaRepository.findById(id.getValue()).map(mapper::toDomain);
    }

    @Override
    public void updatePasswordHash(StaffUserId id, String newPasswordHash) {
        jpaRepository.findById(id.getValue()).ifPresent(entity -> {
            entity.setPasswordHash(newPasswordHash);
            jpaRepository.save(entity);
        });
    }

    @Override
    public List<StaffUser> findAll() {
        return StreamSupport.stream(jpaRepository.findAll().spliterator(), false)
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }
}
