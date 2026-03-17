package com.nac.slogbaa.progress.application.dto;

/** Single entry in the leaderboard ranking. */
public record LeaderboardEntryDto(
        int rank,
        String displayName,
        long completedCourses
) {}
