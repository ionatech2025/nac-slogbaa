package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeSettingsEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeSettingsRepository;
import com.nac.slogbaa.progress.application.port.out.TraineeSettingsPort;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TraineeSettingsAdapter implements TraineeSettingsPort {

    private final JpaTraineeSettingsRepository repository;

    public TraineeSettingsAdapter(JpaTraineeSettingsRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean isCertificateEmailOptIn(UUID traineeId) {
        return repository.findByTraineeId(traineeId)
                .map(TraineeSettingsEntity::isCertificateEmailOptIn)
                .orElse(false);
    }

    @Override
    public void setCertificateEmailOptIn(UUID traineeId, boolean optIn) {
        TraineeSettingsEntity entity = repository.findByTraineeId(traineeId)
                .orElseGet(() -> {
                    TraineeSettingsEntity e = new TraineeSettingsEntity();
                    e.setTraineeId(traineeId);
                    return e;
                });
        entity.setCertificateEmailOptIn(optIn);
        repository.save(entity);
    }
}
