package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.command.RegisterTraineeCommand;
import com.nac.slogbaa.iam.application.dto.result.RegisterTraineeResult;
import com.nac.slogbaa.iam.application.port.in.RegisterTraineeUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.entity.Profile;
import com.nac.slogbaa.iam.core.exception.DuplicateEmailException;
import com.nac.slogbaa.iam.core.valueobject.District;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.FullName;
import com.nac.slogbaa.iam.core.valueobject.Gender;
import com.nac.slogbaa.iam.core.valueobject.PhysicalAddress;
import com.nac.slogbaa.iam.core.valueobject.TraineeCategory;
import com.nac.slogbaa.iam.core.valueobject.TraineeId;

import java.time.Instant;
import java.util.UUID;

/**
 * Application service: register a new trainee. Uses only ports; no framework dependency.
 */
public final class RegisterTraineeService implements RegisterTraineeUseCase {

    private final TraineeRepositoryPort traineeRepository;
    private final StaffUserRepositoryPort staffUserRepository;
    private final PasswordHasherPort passwordHasher;

    public RegisterTraineeService(TraineeRepositoryPort traineeRepository,
                                  StaffUserRepositoryPort staffUserRepository,
                                  PasswordHasherPort passwordHasher) {
        this.traineeRepository = traineeRepository;
        this.staffUserRepository = staffUserRepository;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public RegisterTraineeResult register(RegisterTraineeCommand command) {
        Email email = new Email(command.getEmail());
        // enforce that staff cannot register as trainee (email must be unique across both)
        if(staffUserRepository.findByEmail(email).isPresent()) {
			throw new UnsupportedOperationException("Staff cannot register here");
		}
                
        if (traineeRepository.findByEmail(email).isPresent()
                || staffUserRepository.findByEmail(email).isPresent()) {
            throw new DuplicateEmailException(email.getValue());
        }
        String hashedPassword = passwordHasher.hash(command.getPassword());
        FullName fullName = new FullName(command.getFirstName(), command.getLastName());
        Gender gender = Gender.valueOf(command.getGender().toUpperCase());
        District district = new District(command.getDistrictName());
        PhysicalAddress address = new PhysicalAddress(
                command.getStreet(),
                command.getCity(),
                command.getPostalCode()
        );
        TraineeCategory category = TraineeCategory.valueOf(command.getTraineeCategory().toUpperCase().replace("-", "_"));
        Profile profile = new Profile(fullName, gender, district, command.getRegion(), category, address);

        TraineeId id = new TraineeId(UUID.randomUUID());
        Trainee trainee = new Trainee(
                id,
                email,
                hashedPassword,
                profile,
                true,
                Instant.now(),
                false
        );
        traineeRepository.save(trainee);
        return new RegisterTraineeResult(id.getValue(), email.getValue());
    }
}
