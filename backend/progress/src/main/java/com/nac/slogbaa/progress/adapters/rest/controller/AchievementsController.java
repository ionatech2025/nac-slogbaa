package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.iam.core.valueobject.AuthenticatedIdentity;
import com.nac.slogbaa.progress.application.dto.AchievementsResult;
import com.nac.slogbaa.progress.application.port.in.GetTraineeAchievementsUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for trainee achievements (badges + XP). TRAINEE only.
 */
@RestController
@RequestMapping("/api/me")
@PreAuthorize("hasRole('TRAINEE')")
public class AchievementsController {

    private final GetTraineeAchievementsUseCase getTraineeAchievementsUseCase;

    public AchievementsController(GetTraineeAchievementsUseCase getTraineeAchievementsUseCase) {
        this.getTraineeAchievementsUseCase = getTraineeAchievementsUseCase;
    }

    @GetMapping("/achievements")
    public ResponseEntity<AchievementsResult> getAchievements(
            @AuthenticationPrincipal AuthenticatedIdentity identity) {
        return ResponseEntity.ok(getTraineeAchievementsUseCase.getAchievements(identity.getUserId()));
    }
}
