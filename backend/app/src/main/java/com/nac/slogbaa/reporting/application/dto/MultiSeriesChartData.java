package com.nac.slogbaa.reporting.application.dto;

import java.util.List;
import java.util.Map;

public record MultiSeriesChartData(
    List<String> xAxisLabels,
    Map<String, List<Double>> seriesData
) {}
