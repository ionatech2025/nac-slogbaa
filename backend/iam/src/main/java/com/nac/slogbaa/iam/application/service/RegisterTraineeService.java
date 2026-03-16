package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.command.RegisterTraineeCommand;
import com.nac.slogbaa.iam.application.dto.result.RegisterTraineeResult;
import com.nac.slogbaa.iam.application.port.in.RegisterTraineeUseCase;
import com.nac.slogbaa.iam.application.port.out.PasswordHasherPort;
import com.nac.slogbaa.iam.application.port.out.StaffUserRepositoryPort;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.shared.ports.TraineeNotificationPort;
import com.nac.slogbaa.iam.core.aggregate.Trainee;
import com.nac.slogbaa.iam.core.entity.Profile;
import com.nac.slogbaa.iam.core.exception.DuplicateEmailException;
import com.nac.slogbaa.iam.core.exception.StaffCannotSelfRegisterException;
import com.nac.slogbaa.iam.core.valueobject.District;
import com.nac.slogbaa.iam.core.valueobject.Email;
import com.nac.slogbaa.iam.core.valueobject.FullName;
import com.nac.slogbaa.iam.core.valueobject.Gender;
import com.nac.slogbaa.iam.core.valueobject.PhoneNumber;
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
    private final TraineeNotificationPort traineeNotificationPort;

    public RegisterTraineeService(TraineeRepositoryPort traineeRepository,
                                  StaffUserRepositoryPort staffUserRepository,
                                  PasswordHasherPort passwordHasher,
                                  TraineeNotificationPort traineeNotificationPort) {
        this.traineeRepository = traineeRepository;
        this.staffUserRepository = staffUserRepository;
        this.passwordHasher = passwordHasher;
        this.traineeNotificationPort = traineeNotificationPort;
    }

    @Override
    public RegisterTraineeResult register(RegisterTraineeCommand command) {
        Email email = new Email(command.getEmail());
        if (staffUserRepository.findByEmail(email).isPresent()) {
            throw new StaffCannotSelfRegisterException(email.getValue());
        }
        if (traineeRepository.findByEmail(email).isPresent()) {
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
        PhoneNumber phone = null;
        String cc = command.getPhoneCountryCode() != null ? command.getPhoneCountryCode().trim() : null;
        String nn = command.getPhoneNationalNumber() != null ? command.getPhoneNationalNumber().trim().replaceAll("\\s", "") : null;
        if (cc != null && !cc.isEmpty() || nn != null && !nn.isEmpty()) {
            phone = new PhoneNumber(cc, nn);
        }
        Profile profile = new Profile(fullName, gender, district, command.getRegion(), category, address, phone);

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

        traineeNotificationPort.sendTraineeWelcomeEmail(email.getValue(), fullName.getFullName());

        return new RegisterTraineeResult(id.getValue(), email.getValue());
    }
}
