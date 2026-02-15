package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.command.UpdateProfileCommand;
import com.nac.slogbaa.iam.application.port.in.UpdateTraineeProfileUseCase;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.entity.Profile;
import com.nac.slogbaa.iam.core.valueobject.*;
import com.nac.slogbaa.iam.core.exception.TraineeNotFoundException;

import java.util.UUID;

/**
 * Application service: update trainee profile. Loads trainee, builds updated profile, saves.
 */
public final class UpdateTraineeProfileService implements UpdateTraineeProfileUseCase {

    private final TraineeRepositoryPort traineeRepository;

    public UpdateTraineeProfileService(TraineeRepositoryPort traineeRepository) {
        this.traineeRepository = traineeRepository;
    }

    @Override
    public void update(UUID traineeId, UpdateProfileCommand command) {
        Trainee existing = traineeRepository.findById(traineeId)
                .orElseThrow(() -> new TraineeNotFoundException(traineeId));

        FullName fullName = new FullName(command.getFirstName(), command.getLastName());
        Gender gender = Gender.valueOf(command.getGender().toUpperCase());
        District district = new District(command.getDistrictName());
        PhysicalAddress address = new PhysicalAddress(
                command.getStreet(),
                command.getCity(),
                command.getPostalCode()
        );
        TraineeCategory category = TraineeCategory.valueOf(
                command.getCategory().toUpperCase().replace("-", "_")
        );
        Profile profile = new Profile(fullName, gender, district, command.getRegion(), category, address);

        Trainee updated = new Trainee(
                existing.getId(),
                existing.getEmail(),
                existing.getPasswordHash(),
                profile,
                existing.isActive(),
                existing.getRegistrationDate(),
                existing.isEmailVerified()
        );
        traineeRepository.save(updated);
    }
}
