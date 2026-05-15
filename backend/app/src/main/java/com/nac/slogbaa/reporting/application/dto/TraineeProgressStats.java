package com.nac.slogbaa.reporting.application.dto;

public record TraineeProgressStats(
    String averageDaysToCompletion,
    String globalDropoutRate
) {}
