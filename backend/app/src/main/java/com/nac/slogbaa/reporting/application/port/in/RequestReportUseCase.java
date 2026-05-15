package com.nac.slogbaa.reporting.application.port.in;

import com.nac.slogbaa.reporting.domain.valueobject.ReportType;

import java.util.UUID;

public interface RequestReportUseCase {
    UUID requestReport(ReportType type, String requestedByUserId);
}
