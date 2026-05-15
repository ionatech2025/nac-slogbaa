package com.nac.slogbaa.reporting.application.dto;

import java.util.List;

public record SimpleChartData(
    String seriesName,
    List<String> labels,
    List<Double> values
) {}
