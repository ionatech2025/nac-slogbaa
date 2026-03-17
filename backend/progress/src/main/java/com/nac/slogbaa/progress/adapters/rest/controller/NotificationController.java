package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.NotificationResult;
import com.nac.slogbaa.progress.application.port.in.GetNotificationsUseCase;
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

/**
 * REST controller for trainee in-app notifications.
 */
@RestController
@RequestMapping("/api/me/notifications")
public class NotificationController {

    private final GetNotificationsUseCase getNotificationsUseCase;

    public NotificationController(GetNotificationsUseCase getNotificationsUseCase) {
        this.getNotificationsUseCase = getNotificationsUseCase;
    }

    @GetMapping
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Page<NotificationResult>> getNotifications(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        Page<NotificationResult> result = getNotificationsUseCase.getNotifications(identity.getUserId(), pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        long count = getNotificationsUseCase.getUnreadCount(identity.getUserId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @PathVariable UUID id) {
        boolean found = getNotificationsUseCase.markAsRead(identity.getUserId(), id);
        if (!found) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    @PreAuthorize("hasRole('TRAINEE')")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        getNotificationsUseCase.markAllAsRead(identity.getUserId());
        return ResponseEntity.noContent().build();
    }
}
