package com.nac.slogbaa.reporting.infrastructure.adapter.in.web.dto;

import com.nac.slogbaa.reporting.domain.valueobject.ReportType;

public record ReportRequest(
    ReportType reportType
) {}
