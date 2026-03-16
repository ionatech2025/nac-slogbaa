package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.BadgeDefinitionEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.TraineeBadgeEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaBadgeDefinitionRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaTraineeBadgeRepository;
import com.nac.slogbaa.progress.application.port.out.BadgePort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class BadgeAdapter implements BadgePort {

    private final JpaBadgeDefinitionRepository badgeDefRepo;
    private final JpaTraineeBadgeRepository traineeBadgeRepo;

    public BadgeAdapter(JpaBadgeDefinitionRepository badgeDefRepo,
                        JpaTraineeBadgeRepository traineeBadgeRepo) {
        this.badgeDefRepo = badgeDefRepo;
        this.traineeBadgeRepo = traineeBadgeRepo;
    }

    @Override
    public List<BadgeData> getAllDefinitions() {
        return badgeDefRepo.findAll().stream()
                .map(e -> new BadgeData(e.getId(), e.getName(), e.getDescription(),
                        e.getIconName(), e.getTriggerType(), e.getXpReward()))
                .toList();
    }

    @Override
    public List<TraineeBadgeData> getTraineeBadges(UUID traineeId) {
        return traineeBadgeRepo.findByTraineeId(traineeId).stream()
                .map(e -> new TraineeBadgeData(e.getBadgeId(), e.getAwardedAt()))
                .toList();
    }

    @Override
    public boolean awardBadge(UUID traineeId, UUID badgeId) {
        if (traineeBadgeRepo.existsByTraineeIdAndBadgeId(traineeId, badgeId)) {
            return false;
        }
        TraineeBadgeEntity entity = new TraineeBadgeEntity();
        entity.setTraineeId(traineeId);
        entity.setBadgeId(badgeId);
        traineeBadgeRepo.save(entity);
        return true;
    }

    @Override
    public boolean hasTraineeBadge(UUID traineeId, UUID badgeId) {
        return traineeBadgeRepo.existsByTraineeIdAndBadgeId(traineeId, badgeId);
    }
}
