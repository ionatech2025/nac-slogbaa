package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.LeaderboardEntryDto;

import java.util.List;

/** Use case: get top trainees by completed courses. */
public interface GetLeaderboardUseCase {

    List<LeaderboardEntryDto> getLeaderboard(int limit);
}
