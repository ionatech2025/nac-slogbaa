package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.StreakResult;
import com.nac.slogbaa.progress.application.port.in.GetStreakUseCase;
import com.nac.slogbaa.progress.application.port.in.RecordActivityUseCase;
import com.nac.slogbaa.progress.application.port.in.UpdateDailyGoalUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for streak and daily activity tracking. TRAINEE only.
 */
@RestController
@RequestMapping("/api/me")
@PreAuthorize("hasRole('TRAINEE')")
public class StreakController {

    private final GetStreakUseCase getStreakUseCase;
    private final RecordActivityUseCase recordActivityUseCase;
    private final UpdateDailyGoalUseCase updateDailyGoalUseCase;

    public StreakController(GetStreakUseCase getStreakUseCase,
                            RecordActivityUseCase recordActivityUseCase,
                            UpdateDailyGoalUseCase updateDailyGoalUseCase) {
        this.getStreakUseCase = getStreakUseCase;
        this.recordActivityUseCase = recordActivityUseCase;
        this.updateDailyGoalUseCase = updateDailyGoalUseCase;
    }

    @GetMapping("/streak")
    public ResponseEntity<StreakResult> getStreak(@AuthenticationPrincipal AuthenticatedIdentity identity) {
        return ResponseEntity.ok(getStreakUseCase.getStreak(identity.getUserId()));
    }

    @PostMapping("/activity")
    public ResponseEntity<Void> recordActivity(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestBody RecordActivityRequest request) {
        recordActivityUseCase.record(identity.getUserId(), request.minutesSpent());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/daily-goal")
    public ResponseEntity<Void> updateDailyGoal(
            @AuthenticationPrincipal AuthenticatedIdentity identity,
            @RequestBody UpdateDailyGoalRequest request) {
        updateDailyGoalUseCase.update(identity.getUserId(), request.minutes());
        return ResponseEntity.noContent().build();
    }

    public record RecordActivityRequest(int minutesSpent) {}
    public record UpdateDailyGoalRequest(int minutes) {}
}
