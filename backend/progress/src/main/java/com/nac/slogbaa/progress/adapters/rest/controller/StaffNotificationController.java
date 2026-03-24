package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.NotificationResult;
import com.nac.slogbaa.progress.application.port.in.GetStaffNotificationsUseCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/me/staff-notifications")
public class StaffNotificationController {

    private final GetStaffNotificationsUseCase getStaffNotificationsUseCase;

    public StaffNotificationController(GetStaffNotificationsUseCase getStaffNotificationsUseCase) {
        this.getStaffNotificationsUseCase = getStaffNotificationsUseCase;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Page<NotificationResult>> list(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        return ResponseEntity.ok(getStaffNotificationsUseCase.listForStaff(identity.getUserId(), pageable));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Map<String, Long>> unreadCount(@AuthenticationPrincipal AuthenticatedIdentity identity) {
        long count = getStaffNotificationsUseCase.unreadCountForStaff(identity.getUserId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Void> markRead(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID id) {
        boolean ok = getStaffNotificationsUseCase.markStaffNotificationRead(identity.getUserId(), id);
        if (!ok) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal AuthenticatedIdentity identity) {
        getStaffNotificationsUseCase.markAllStaffNotificationsRead(identity.getUserId());
        return ResponseEntity.noContent().build();
    }
}
