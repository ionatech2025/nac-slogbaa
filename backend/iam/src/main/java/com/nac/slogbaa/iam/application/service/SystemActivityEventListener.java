package com.nac.slogbaa.iam.application.service;

import com.nac.slogbaa.iam.adapters.persistence.entity.AdminActivityLogEntity;
import com.nac.slogbaa.iam.adapters.persistence.repository.AdminActivityLogRepository;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaStaffUserRepository;
import com.nac.slogbaa.iam.adapters.persistence.repository.JpaTraineeRepository;
import com.nac.slogbaa.shared.events.SystemActivityEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemActivityEventListener {

    private final AdminActivityLogRepository adminActivityLogRepository;
    private final JpaStaffUserRepository staffUserRepository;
    private final JpaTraineeRepository traineeUserRepository;

    public SystemActivityEventListener(
            AdminActivityLogRepository adminActivityLogRepository,
            JpaStaffUserRepository staffUserRepository,
            JpaTraineeRepository traineeUserRepository) {
        this.adminActivityLogRepository = adminActivityLogRepository;
        this.staffUserRepository = staffUserRepository;
        this.traineeUserRepository = traineeUserRepository;
    }

    @Async
    @EventListener
    @Transactional
    public void handleSystemActivityEvent(SystemActivityEvent event) {
        String email = "system@slogbaa.nac.go.ug";
        String role = event.getActorRole();

        if (event.getActorId() != null) {
            var staffOpt = staffUserRepository.findById(event.getActorId());
            if (staffOpt.isPresent()) {
                email = staffOpt.get().getEmail();
                if (role == null) {
                    role = staffOpt.get().getStaffRole().name();
                }
            } else {
                var traineeOpt = traineeUserRepository.findById(event.getActorId());
                if (traineeOpt.isPresent()) {
                    email = traineeOpt.get().getEmail();
                    if (role == null) {
                        role = "TRAINEE";
                    }
                }
            }
        }

        if (role == null) {
            role = "SYSTEM";
        }

        AdminActivityLogEntity logEntity = new AdminActivityLogEntity(
                event.getActorId(),
                email,
                role,
                event.getActionType(),
                event.getTargetId(),
                event.getDescription()
        );
        adminActivityLogRepository.save(logEntity);
    }
}
