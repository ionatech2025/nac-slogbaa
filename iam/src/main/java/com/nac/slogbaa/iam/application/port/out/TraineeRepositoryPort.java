package com.nac.slogbaa.iam.application.port.out;

import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.valueobject.Email;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port for trainee persistence. Implementations (JPA) in adapters.
 * No framework dependency in this interface.
 */
public interface TraineeRepositoryPort {

    Trainee save(Trainee trainee);

    Optional<Trainee> findByEmail(Email email);

    Optional<Trainee> findById(UUID id);

    List<Trainee> findAll();

    long count();

    void deleteById(UUID id);
}
