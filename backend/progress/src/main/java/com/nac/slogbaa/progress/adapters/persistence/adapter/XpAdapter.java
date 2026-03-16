package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeXpEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeXpRepository;
import com.nac.slogbaa.progress.application.port.out.XpPort;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class XpAdapter implements XpPort {

    private final JpaTraineeXpRepository xpRepo;

    public XpAdapter(JpaTraineeXpRepository xpRepo) {
        this.xpRepo = xpRepo;
    }

    @Override
    public int getXp(UUID traineeId) {
        return xpRepo.findByTraineeId(traineeId)
                .map(TraineeXpEntity::getTotalXp)
                .orElse(0);
    }

    @Override
    public void addXp(UUID traineeId, int amount) {
        TraineeXpEntity entity = xpRepo.findByTraineeId(traineeId)
                .orElseGet(() -> {
                    TraineeXpEntity e = new TraineeXpEntity();
                    e.setTraineeId(traineeId);
                    return e;
                });
        entity.setTotalXp(entity.getTotalXp() + amount);
        xpRepo.save(entity);
    }
}
