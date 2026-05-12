package com.nac.slogbaa.iam.adapters.persistence;

import com.nac.slogbaa.iam.adapters.persistence.entity.AdminActivityLogEntity;
import com.nac.slogbaa.iam.adapters.persistence.entity.StaffUserEntity;
import com.nac.slogbaa.iam.adapters.persistence.repository.AdminActivityLogRepository;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaStaffUserRepository;
import com.nac.slogbaa.iam.application.port.out.AdminActivityPort;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AdminActivityAdapter implements AdminActivityPort {

    private final AdminActivityLogRepository adminActivityLogRepository;
    private final JpaStaffUserRepository staffUserRepository;

    public AdminActivityAdapter(AdminActivityLogRepository adminActivityLogRepository,
                                JpaStaffUserRepository staffUserRepository) {
        this.adminActivityLogRepository = adminActivityLogRepository;
        this.staffUserRepository = staffUserRepository;
    }

    @Override
    public void logActivity(UUID actorId, String actionType, String targetId, String description) {
        StaffUserEntity actor = staffUserRepository.findById(actorId).orElse(null);
        if (actor == null) {
            return;
        }
        AdminActivityLogEntity logEntity = new AdminActivityLogEntity(
                actorId,
                actor.getEmail(),
                actor.getStaffRole().name(),
                actionType,
                targetId,
                description
        );
        adminActivityLogRepository.save(logEntity);
    }
}
