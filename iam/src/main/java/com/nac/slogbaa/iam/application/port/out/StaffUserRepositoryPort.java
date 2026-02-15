package com.nac.slogbaa.iam.application.port.out;

import com.nac.slogbaa.iam.core.aggregate.StaffUser;
import com.nac.slogbaa.iam.core.valueobject.Email;

import java.util.List;
import java.util.Optional;

/**
 * Port for staff user persistence. Implementations (JPA) in adapters.
 * No framework dependency in this interface.
 */
public interface StaffUserRepositoryPort {

    Optional<StaffUser> findByEmail(Email email);

    List<StaffUser> findAll();

    long count();
}
