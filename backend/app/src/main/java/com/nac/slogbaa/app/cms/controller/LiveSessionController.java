package com.nac.slogbaa.app.cms.controller;

import com.nac.slogbaa.app.cms.dto.LiveSessionDtos.LiveSessionAdminResponse;
import com.nac.slogbaa.app.cms.dto.LiveSessionDtos.LiveSessionTraineeResponse;
import com.nac.slogbaa.app.cms.dto.LiveSessionDtos.LiveSessionUpsertRequest;
import com.nac.slogbaa.app.cms.service.LiveSessionApplicationService;
import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import com.nac.slogbaa.shared.events.SystemActivityEvent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LiveSessionController {

    private final LiveSessionApplicationService liveSessionApplicationService;
    private final ApplicationEventPublisher eventPublisher;

    public LiveSessionController(LiveSessionApplicationService liveSessionApplicationService, ApplicationEventPublisher eventPublisher) {
        this.liveSessionApplicationService = liveSessionApplicationService;
        this.eventPublisher = eventPublisher;
    }

    /** Trainee: active sessions with phase, registration, credentials only when registered. */
    @GetMapping("/live-sessions")
    @PreAuthorize("hasRole('TRAINEE')")
    public List<LiveSessionTraineeResponse> listForTrainee(@AuthenticationPrincipal AuthenticatedIdentity identity) {
        return liveSessionApplicationService.listForTrainee(identity.getUserId());
    }

    @PostMapping("/live-sessions/{id}/register")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> register(
            @PathVariable UUID id, @AuthenticationPrincipal AuthenticatedIdentity identity) {
        liveSessionApplicationService.register(id, identity.getUserId());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/live-sessions/{id}/register")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> unregister(
            @PathVariable UUID id, @AuthenticationPrincipal AuthenticatedIdentity identity) {
        liveSessionApplicationService.unregister(id, identity.getUserId());
        return ResponseEntity.noContent().build();
    }

    /** Admin + Super Admin: all sessions including inactive, with registration counts and full credentials. */
    @GetMapping("/admin/live-sessions")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<LiveSessionAdminResponse> listAllForAdmin() {
        return liveSessionApplicationService.listAllForAdmin();
    }

    @PostMapping("/admin/live-sessions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<LiveSessionAdminResponse> create(
            @Valid @RequestBody LiveSessionUpsertRequest body,
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        LiveSessionAdminResponse response = liveSessionApplicationService.create(body, identity.getUserId());
        eventPublisher.publishEvent(new SystemActivityEvent(
                identity.getUserId(),
                identity.getRole().name(),
                "CREATE",
                response.id().toString(),
                "Created live session: " + response.title()
        ));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/admin/live-sessions/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public LiveSessionAdminResponse update(
            @PathVariable UUID id, 
            @Valid @RequestBody LiveSessionUpsertRequest body,
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        LiveSessionAdminResponse response = liveSessionApplicationService.update(id, body);
        eventPublisher.publishEvent(new SystemActivityEvent(
                identity.getUserId(),
                identity.getRole().name(),
                "UPDATE",
                id.toString(),
                "Updated live session: " + response.title()
        ));
        return response;
    }

    @DeleteMapping("/admin/live-sessions/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        liveSessionApplicationService.delete(id);
        eventPublisher.publishEvent(new SystemActivityEvent(
                identity.getUserId(),
                identity.getRole().name(),
                "DELETE",
                id.toString(),
                "Deleted live session"
        ));
        return ResponseEntity.noContent().build();
    }
}
