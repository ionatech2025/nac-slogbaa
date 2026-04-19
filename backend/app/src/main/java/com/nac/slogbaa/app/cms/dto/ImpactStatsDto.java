package com.nac.slogbaa.app.cms.dto;

import java.util.Map;

public record ImpactStatsDto(
    long coursesDone,
    long certificatesIssued,
    long traineeCount,
    long coursesAvailable,
    long districtsCount,
    Map<String, Long> demographicsByDistrict,
    Map<String, Long> demographicsByGender,
    double avgTraineeRating,
    double avgAdminRating
) {}
