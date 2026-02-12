package com.nac.slogbaa.iam.adapters.persistence.adapter;

import com.nac.slogbaa.iam.adapters.persistence.mappers.StaffUserEntityMapper;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaStaffUserRepository;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.Email;
import org.springframework.stereotype.Component;

import java.util.Optional;

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
}
