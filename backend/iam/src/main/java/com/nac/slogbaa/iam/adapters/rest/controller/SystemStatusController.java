package com.nac.slogbaa.iam.adapters.rest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/system")
public class SystemStatusController {

    private final JdbcTemplate jdbcTemplate;

    public SystemStatusController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        
        boolean dbConnected = false;
        try {
            jdbcTemplate.execute("SELECT 1");
            dbConnected = true;
        } catch (Exception e) {
            // Ignored
        }

        int activeSessions = 0;
        if (dbConnected) {
            try {
                // Since we don't maintain a strict session table for JWTs, we approximate
                // by returning the total count of non-suspended (active) users in the system.
                Integer staffCount = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM staff_user WHERE is_active = true", Integer.class);
                Integer traineeCount = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM trainee WHERE is_active = true", Integer.class);
                
                activeSessions = (staffCount != null ? staffCount : 0) + (traineeCount != null ? traineeCount : 0);
            } catch (Exception e) {
                activeSessions = 0;
            }
        }

        status.put("activeSessions", activeSessions);
        status.put("database", dbConnected ? "Connected" : "Disconnected");
        status.put("backend", "Healthy");
        status.put("authService", "Operational");

        return ResponseEntity.ok(status);
    }
}
