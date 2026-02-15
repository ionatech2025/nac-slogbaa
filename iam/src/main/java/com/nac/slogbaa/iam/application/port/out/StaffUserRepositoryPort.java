package com.nac.slogbaa.iam.application.port.out;

import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.StaffRole;
import com.nac.slogbaa.iam.core.valueobject.StaffUserId;

import java.util.List;
import java.util.Optional;

/**
 * Port for staff user persistence. Implementations (JPA) in adapters.
 * No framework dependency in this interface.
 */
public interface StaffUserRepositoryPort {

    Optional<StaffUser> findByEmail(Email email);

    Optional<StaffUser> findById(StaffUserId id);

    List<StaffUser> findAll();

    long count();

    long countByRole(StaffRole role);

    void save(StaffUser staffUser);

    void deleteById(StaffUserId id);

    void updatePasswordHash(StaffUserId id, String newPasswordHash);
}
