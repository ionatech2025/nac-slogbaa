package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.iam.application.port.out.TraineeRepositoryPort;
import com.nac.slogbaa.iam.core.aggregate.Trainee;

import java.util.Optional;
import java.util.UUID;

/**
 * Application service: get trainee details by id.
 */
public final class GetTraineeByIdService implements GetTraineeByIdUseCase {

    private final TraineeRepositoryPort traineeRepository;

    public GetTraineeByIdService(TraineeRepositoryPort traineeRepository) {
        this.traineeRepository = traineeRepository;
    }

    @Override
    public Optional<TraineeDetails> getById(UUID traineeId) {
        return traineeRepository.findById(traineeId).map(this::toDetails);
    }

    private TraineeDetails toDetails(Trainee t) {
        String phoneCc = null;
        String phoneNn = null;
        if (t.getProfile().getPhoneNumber() != null && t.getProfile().getPhoneNumber().isPresent()) {
            phoneCc = t.getProfile().getPhoneNumber().getCountryCode();
            phoneNn = t.getProfile().getPhoneNumber().getNationalNumber();
        }
        return new TraineeDetails(
                t.getId().getValue(),
                t.getEmail().getValue(),
                t.getProfile().getFullName().getFirstName(),
                t.getProfile().getFullName().getLastName(),
                t.getProfile().getGender().name(),
                t.getProfile().getDistrict().getName(),
                t.getProfile().getRegion(),
                t.getProfile().getCategory().name(),
                t.getProfile().getAddress().getStreet(),
                t.getProfile().getAddress().getCity(),
                t.getProfile().getAddress().getPostalCode(),
                phoneCc,
                phoneNn,
                t.getProfileImageUrl()
        );
    }
}
