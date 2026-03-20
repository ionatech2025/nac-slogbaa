package com.nac.slogbaa.progress.adapters.rest.controller;

import com.nac.slogbaa.progress.application.dto.LeaderboardEntryDto;
import com.nac.slogbaa.progress.application.port.in.GetLeaderboardUseCase;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public (authenticated) leaderboard endpoint.
 * GET /api/leaderboard?limit=10
 */
@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final GetLeaderboardUseCase getLeaderboardUseCase;

    public LeaderboardController(GetLeaderboardUseCase getLeaderboardUseCase) {
        this.getLeaderboardUseCase = getLeaderboardUseCase;
    }

    @GetMapping
    @Cacheable("leaderboard")
    public ResponseEntity<List<LeaderboardEntryResponse>> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<LeaderboardEntryDto> entries = getLeaderboardUseCase.getLeaderboard(limit);
        List<LeaderboardEntryResponse> body = entries.stream()
                .map(e -> new LeaderboardEntryResponse(e.rank(), e.displayName(), e.completedCourses()))
                .toList();
        return ResponseEntity.ok(body);
    }

    public record LeaderboardEntryResponse(int rank, String displayName, long completedCourses) {}
}
