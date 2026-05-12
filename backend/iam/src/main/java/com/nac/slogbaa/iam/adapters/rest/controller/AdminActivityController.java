package com.nac.slogbaa.iam.adapters.rest.controller;

import com.nac.slogbaa.iam.adapters.persistence.entity.AdminActivityLogEntity;
import com.nac.slogbaa.iam.adapters.persistence.repository.AdminActivityLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/activities")
public class AdminActivityController {

    private final AdminActivityLogRepository adminActivityLogRepository;

    public AdminActivityController(AdminActivityLogRepository adminActivityLogRepository) {
        this.adminActivityLogRepository = adminActivityLogRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<AdminActivityResponse>> getActivities() {
        List<AdminActivityLogEntity> logs = adminActivityLogRepository.findAllByOrderByCreatedAtDesc();
        List<AdminActivityResponse> responses = logs.stream()
                .map(log -> new AdminActivityResponse(
                        log.getId(),
                        log.getActorId(),
                        log.getActorEmail(),
                        log.getActorRole(),
                        log.getActionType(),
                        log.getTargetId(),
                        log.getDescription(),
                        log.getCreatedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    public record AdminActivityResponse(
            UUID id,
            UUID actorId,
            String actorEmail,
            String actorRole,
            String actionType,
            String targetId,
            String description,
            Instant createdAt
    ) {}
}
