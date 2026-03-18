package com.nac.slogbaa.app.cms.controller;

import com.nac.slogbaa.app.cms.entity.LiveSession;
import com.nac.slogbaa.app.cms.repository.LiveSessionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class LiveSessionController {

    private final LiveSessionRepository repo;

    public LiveSessionController(LiveSessionRepository repo) {
        this.repo = repo;
    }

    /** Trainee view: active sessions only */
    @GetMapping("/live-sessions")
    public List<LiveSession> listActive() {
        return repo.findByActiveTrueOrderByScheduledAtDesc();
    }

    /** Admin: all sessions */
    @GetMapping("/admin/live-sessions")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public List<LiveSession> listAll() {
        return repo.findAll();
    }

    @PostMapping("/admin/live-sessions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<LiveSession> create(@Valid @RequestBody LiveSession s) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(s));
    }

    @PutMapping("/admin/live-sessions/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<LiveSession> update(@PathVariable UUID id, @Valid @RequestBody LiveSession s) {
        return repo.findById(id).map(existing -> {
            existing.setTitle(s.getTitle());
            existing.setDescription(s.getDescription());
            existing.setProvider(s.getProvider());
            existing.setMeetingUrl(s.getMeetingUrl());
            existing.setScheduledAt(s.getScheduledAt());
            existing.setDurationMinutes(s.getDurationMinutes());
            existing.setActive(s.isActive());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/live-sessions/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
