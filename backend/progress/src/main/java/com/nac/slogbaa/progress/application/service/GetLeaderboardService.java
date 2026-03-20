package com.nac.slogbaa.progress.application.service;

import com.nac.slogbaa.iam.application.dto.result.TraineeDetails;
import com.nac.slogbaa.iam.application.port.in.GetTraineeByIdUseCase;
import com.nac.slogbaa.progress.application.dto.LeaderboardEntryDto;
import com.nac.slogbaa.progress.application.port.in.GetLeaderboardUseCase;
import com.nac.slogbaa.progress.application.port.out.TraineeProgressRepositoryPort;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Returns a leaderboard of trainees ranked by number of completed courses.
 * Display names use "First L." format for privacy.
 */
public final class GetLeaderboardService implements GetLeaderboardUseCase {

    private final TraineeProgressRepositoryPort traineeProgressRepository;
    private final GetTraineeByIdUseCase getTraineeByIdUseCase;

    public GetLeaderboardService(TraineeProgressRepositoryPort traineeProgressRepository,
                                 GetTraineeByIdUseCase getTraineeByIdUseCase) {
        this.traineeProgressRepository = traineeProgressRepository;
        this.getTraineeByIdUseCase = getTraineeByIdUseCase;
    }

    @Override
    public List<LeaderboardEntryDto> getLeaderboard(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        List<Map.Entry<UUID, Long>> topTrainees = traineeProgressRepository.findTopTraineesByCompletions(safeLimit);

        List<LeaderboardEntryDto> entries = new ArrayList<>();
        int rank = 1;
        for (Map.Entry<UUID, Long> entry : topTrainees) {
            String displayName = getTraineeByIdUseCase.getById(entry.getKey())
                    .map(GetLeaderboardService::formatDisplayName)
                    .orElse("Trainee");
            entries.add(new LeaderboardEntryDto(rank++, displayName, entry.getValue()));
        }
        return entries;
    }

    /** Format as "First L." for privacy (first name + last initial). */
    private static String formatDisplayName(TraineeDetails details) {
        String first = details.getFirstName();
        String last = details.getLastName();
        if (first == null || first.isBlank()) return "Trainee";
        if (last == null || last.isBlank()) return first.trim();
        return first.trim() + " " + last.trim().charAt(0) + ".";
    }
}
